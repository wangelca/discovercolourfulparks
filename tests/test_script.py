# Automated tests for Discover Colorful Parks using Playwright and Brave
# By - Angelica Pekas, Ebube Okonmah

import unittest
import time
import asyncio
from playwright.sync_api import sync_playwright

class DCPTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Start Playwright
        cls.playwright = sync_playwright().start()

        # Specify the path to the Brave browser executable
        brave_path = r'C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe'  # Update this path if necessary

        # Launch Brave browser using Playwright
        cls.browser = cls.playwright.chromium.launch(
            executable_path=brave_path,
            headless=False  # Set to True if you prefer headless mode (no browser UI)
        )

        # Create a new browser context and page
        cls.context = cls.browser.new_context()
        cls.page = cls.context.new_page()

        # Set the base URL of the application
        cls.base_url = "http://localhost:3000"

    @classmethod
    def tearDownClass(cls):
        # Close the browser context and browser
        cls.context.close()
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        # Navigate to the base URL before each test
        self.page.goto(self.base_url)

    def tearDown(self):
        # Clear cookies to ensure a clean state for the next test
        self.page.context.clear_cookies()

    def login_user(self, email, password):
        try:
            # Click on the 'Sign In' button
            self.page.click("text='Sign In'")

            # Enter the user's email address
            self.page.fill("input[name='identifier']", email)

            # Click 'Continue' to proceed
            self.page.click("button[data-localization-key='formButtonPrimary']")

            # Enter the user's password
            self.page.fill("input[name='password']", password)

            # Click 'Continue' to log in
            self.page.click("button[data-localization-key='formButtonPrimary']")

            # Wait for the user menu to appear, indicating a successful login
            self.page.wait_for_selector(".cl-userButtonBox", timeout=10000)
        except Exception as e:
            # If any step fails, mark the test as failed with an error message
            self.fail(f"Login failed: {str(e)}")

    def test_homepage_loads(self):
        # Check if the page title contains 'Discover Colorful Parks'
        self.assertIn("Discover Colorful Parks", self.page.title(), "Homepage title does not match.")

    def test_navigation_links(self):
        # Define navigation links and their expected URLs
        navigation_links = {
            "Parks": "/parks",
            "Events": "/events",
            "Spots": "/spots",
            "Admissions": "/fees",
            "About Us": "/aboutus"
        }

        for link_text, expected_path in navigation_links.items():
            with self.subTest(link=link_text):
                # Click on the navigation link
                self.page.click(f"text='{link_text}'")

                # Verify that the current URL contains the expected path
                self.assertIn(expected_path, self.page.url, f"Navigation to {link_text} failed.")

                # Go back to the homepage before testing the next link
                self.page.goto(self.base_url)

    def test_hero_section(self):
        # Confirm that the hero section is visible on the page
        self.assertTrue(self.page.is_visible("#default-carousel"), "Hero section is not displayed.")

        # Get the text of the main heading
        heading_text = self.page.text_content("h1")

        # Verify that the main heading contains the expected text
        self.assertIn("Explore the World’s Most Beautiful Parks", heading_text, "Main heading text does not match.")

        # Click the 'Explore Now' button
        self.page.click("text='Explore Now'")

        # Wait for the URL to change to the Parks page
        self.page.wait_for_url(f"{self.base_url}/parks")

        # Check that we have navigated to the '/parks' page
        self.assertIn("/parks", self.page.url, "Did not navigate to /parks after clicking 'Explore Now'.")

    def test_search_function_in_parks(self):
        # Navigate to the Parks page
        self.page.goto(f"{self.base_url}/parks")

        # Enter a search query in the search box
        search_query = "Lake"
        self.page.fill("input[placeholder='Search parks...']", search_query)

        # Wait for the search results to load
        self.page.wait_for_selector(".flex-col > div")

        # Get the list of filtered parks
        filtered_parks = self.page.query_selector_all(".flex-col > div")

        # Ensure that at least one park is found
        self.assertGreater(len(filtered_parks), 0, "No parks found for the search query.")

        # Verify that each park in the results contains the search query in its name
        for park in filtered_parks:
            park_name = park.text_content("h3")
            self.assertIn(search_query.lower(), park_name.lower(), f"Park name '{park_name}' does not match the search query.")

    def test_sign_in_button_visibility(self):
        # Check if the 'Sign In' button is visible
        self.assertTrue(self.page.is_visible("text='Sign In'"), "'Sign In' button is not displayed for unsigned users.")

    def test_sign_in_button_redirect(self):
        # Click on the 'Sign In' button
        self.page.click("text='Sign In'")

        # Check if the Clerk sign-in modal appears
        self.assertTrue(self.page.is_visible(".cl-signIn-root"), "Clerk's sign-in modal did not open after clicking 'Sign In'.")

    def test_successful_login(self):
        # Use the helper method to log in
        self.login_user('visitor@dcp.com', 'visitor')

        # Verify that the user menu is visible, indicating a successful login
        self.assertTrue(self.page.is_visible(".cl-userButtonBox"), "User button is not visible after login.")

    def test_logout(self):
        # First, log in as a user
        self.login_user('visitor@dcp.com', 'visitor')

        # Click on the user menu to open it
        self.page.click(".cl-userButtonBox")

        # Click the 'Sign out' button in the user menu
        self.page.click("button:text('Sign out')")

        # Wait for the 'Sign In' button to reappear
        self.page.wait_for_selector("text='Sign In'")

        # Confirm that the 'Sign In' button is visible again
        self.assertTrue(self.page.is_visible("text='Sign In'"), "'Sign In' button did not reappear after logging out.")

    def test_successful_booking(self):
        try:
            # Log in as a user
            self.login_user('visitor@dcp.com', 'visitor')

            # Navigate to the Parks page
            self.page.click("text='Parks'")

            # Select a specific park (e.g., 'Lake Louise')
            self.page.click("h3:text('Lake Louise')")

            # Click on the 'Book Now' button
            self.page.click("text='Book Now'")

            # Fill in the booking details with check-in and check-out dates
            self.page.fill("input[name='check_in']", '12/01/2024')
            self.page.fill("input[name='check_out']", '12/05/2024')

            # Submit the booking form
            self.page.click("text='Confirm Booking'")

            # Wait for the Stripe checkout page to load
            self.page.wait_for_url("https://checkout.stripe.com/*")

            # Simulate the payment process (this step may require additional handling)
            # Note: Interacting with Stripe's real checkout page in automated tests can be complex due to security measures
            # For testing purposes, you might mock this step or use Stripe's test mode with test cards

            # Assume payment is completed and we're redirected back to the confirmation page

            # Wait for the booking confirmation message to appear
            self.page.wait_for_selector("h2:text('Booking Confirmed')")

            # Verify that the booking confirmation message is displayed
            self.assertTrue(self.page.is_visible("h2:text('Booking Confirmed')"), "Booking confirmation message not displayed.")

        except Exception as e:
            # If any step fails, mark the test as failed with an error message
            self.fail(f"Test failed due to exception: {str(e)}")

    def test_booking_unavailable_spot(self):
        try:
            # Log in as a user
            self.login_user('visitor@dcp.com', 'visitor')

            # Navigate to the Parks page
            self.page.click("text='Parks'")

            # Select a park that is fully booked (e.g., 'Busy Park')
            self.page.click("h3:text('Busy Park')")

            # Click on the 'Book Now' button
            self.page.click("text='Book Now'")

            # Fill in booking details with dates that are unavailable
            self.page.fill("input[name='check_in']", '07/01/2024')
            self.page.fill("input[name='check_out']", '07/05/2024')

            # Submit the booking form
            self.page.click("text='Confirm Booking'")

            # Wait for the error message to appear
            self.page.wait_for_selector(".error-message")

            # Get the text of the error message
            error_message = self.page.text_content(".error-message")

            # Verify that the error message indicates no availability
            self.assertIn("No availability", error_message, "Expected 'No availability' message not displayed.")

        except Exception as e:
            # If any step fails, mark the test as failed with an error message
            self.fail(f"Test failed due to exception: {str(e)}")

if __name__ == "__main__":
    unittest.main()

