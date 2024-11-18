import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


class WebAppTest(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.get("http://localhost:3000")  # Replace with your actual URL

    def setUp(self):
        self.driver.refresh()  # Ensure a fresh start for each test
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
    
    def tearDown(self):
        # Clear cookies to ensure a clean state for the next test
        self.driver.delete_all_cookies()
    
    def login_user(self, email, password):
        try:
            # Click on the 'Sign In' button
            sign_in_button = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
            )
            sign_in_button.click()

            # Enter the user's email address
            email_field = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.ID, "identifier-field"))
            )
            email_field.send_keys(email)

            # Click 'Continue' to proceed
            continue_button = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'cl-formButtonPrimary')]"))
            )
            continue_button.click()

            # Enter the user's password
            password_field = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.NAME, "password"))
            )
            password_field.send_keys(password)

            # Click 'Continue' to log in
            continue_button = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'cl-formButtonPrimary')]"))
            )
            continue_button.click()

            # Wait for the user menu to appear, indicating a successful login
            WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "cl-userButton-root"))
            )
        except TimeoutException as e:
            # If any step fails, mark the test as failed with an error message
            self.fail(f"Login failed: {str(e)}")

    def ensure_signed_out(self):
        try:
            user_button = WebDriverWait(self.driver, 5).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "cl-userButton-root"))
            )
            user_button.click()
            logout_button = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign out')]"))
            )
            logout_button.click()
            WebDriverWait(self.driver, 5).until(
                EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
            )
        except TimeoutException:
            pass  # User is already signed out
    
    # 1. Homepage Load Test
    def test_homepage_loads(self):
        self.assertIn("", self.driver.title)  # the page's title

    # 2. Navigation Links Test
    def test_navigation_links(self):
        # Define the links to test
        navigation_links = {
            "Parks": "/parks",
            "Events": "/events",
            "Spots": "/spots",
            "Admissions": "/fees",
            "About Us": "/aboutus"
        }
        
        for link_text, expected_path in navigation_links.items():
            # Step 1: Ensure homepage loads first
            self.driver.get("http://localhost:3000")
            
            # Step 2: Click on the link
            link = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.LINK_TEXT, link_text))
            )
            link.click()

            # Step 3: Confirm the correct URL
            WebDriverWait(self.driver, 50).until(EC.url_contains(expected_path))

    # 3. Hero Section Test
    def test_hero_section(self):
        # Wait for the hero section to be visible
        hero_section = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "default-carousel"))
        )
        self.assertTrue(hero_section.is_displayed(), "Hero section is not displayed")

        # Verify the hero section includes the main heading text
        heading = self.driver.find_element(By.TAG_NAME, "h1")
        self.assertIn("Explore the World’s Most Beautiful Parks", heading.text)

        # Verify that the call-to-action button is present and clickable
        explore_button = self.driver.find_element(By.LINK_TEXT, "Explore Now")
        self.assertTrue(explore_button.is_displayed(), "Explore Now button is not visible")
        explore_button.click()

        # Confirm clicking the button navigates to the correct page (e.g., /parks)
        WebDriverWait(self.driver, 10).until(EC.url_contains("/parks"))
        self.assertIn("/parks", self.driver.current_url, "Did not navigate to /parks after clicking Explore Now")

    # 4. Search Functionality Test on Parks Page
    def test_search_function_in_parks(self):
        # Navigate to the /parks page
        self.driver.get("http://localhost:3000/parks")  # Adjust URL if necessary

        # Wait until the search input is visible
        search_box = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='Search parks...']"))
        )
        self.assertTrue(search_box.is_displayed(), "Search box is not displayed")

        # Enter a query into the search bar
        search_query = "Lake"  # Replace with a park name or keyword you expect to exist
        search_box.send_keys(search_query)

        # Verify that the filtered results contain the search query
        filtered_parks = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".flex-col > div"))
        )

        # Ensure at least one result appears
        self.assertGreater(len(filtered_parks), 0, "No parks found for the search query")

        # Check if each displayed park's name contains the search query
        for park in filtered_parks:
            park_name = park.find_element(By.TAG_NAME, "h3").text
            self.assertIn(search_query.lower(), park_name.lower(), f"Park name '{park_name}' does not match the search query")


    # Login Tests
    # 1. Test Visibility of the Sign-In Button
    def test_sign_in_button_visibility(self):
        # Navigate to the homepage
        self.driver.get("http://localhost:3000")
        
        # Check if the Sign In button is visible when not signed in
        sign_in_button = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
        )
        self.assertTrue(sign_in_button.is_displayed(), "Sign In button is not displayed for unsigned users")

    # 2. Test Sign-In Button Functionality (Redirect to Modal)
    def test_sign_in_button_redirect(self):
        self.driver.get("http://localhost:3000")  # Ensure homepage loads first
        try:
            # Step 1: Wait for the Sign In button and click it
            sign_in_button = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
            )
            sign_in_button.click()

            # Step 2: Wait for Clerk modal to appear
            clerk_modal = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "cl-signIn-root"))
            )
            self.assertTrue(clerk_modal.is_displayed(), "Clerk's sign-in modal did not open after clicking Sign In")
        except TimeoutException:
            self.fail("Sign In button or modal was not found within the expected time.")


    # 3. Test Successful Login
    def test_successful_login(self):
        # Step 1: Navigate to the homepage and click the Sign In button
        self.driver.get("http://localhost:3000")

        # Ensure the user is signed out before starting the test
        self.ensure_signed_out()

        try:          
            sign_in_button = WebDriverWait(self.driver, 50).until(
                EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
            )
            sign_in_button.click()

            # Step 2: Wait for the Clerk modal to appear and enter the email
            clerk_modal = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "cl-signIn-root"))
            )
            email_field = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.NAME, "identifier"))  # Replace with actual name
            )
            email_field.send_keys("visitor@dcp.com")

            # Step 3: Click the Continue button to proceed to the password entry step
            continue_button = WebDriverWait(self.driver, 40).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@data-localization-key='formButtonPrimary']"))
            )
            continue_button.click()

            # Step 4: Wait for the password field to appear and enter the password
            password_field = WebDriverWait(self.driver, 40).until(
                EC.visibility_of_element_located((By.NAME, "password"))
            )
            password_field.send_keys("visitor")

            # Step 5: Click the Continue button again to complete the login
            continue_button = WebDriverWait(self.driver, 40).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@data-localization-key='formButtonPrimary']"))
            )
            continue_button.click()

            # Step 6: Verify successful login by checking for the presence of the UserButton
            user_button = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "cl-userButtonBox"))
            )
            self.assertTrue(user_button.is_displayed(), "User button is not visible after login")
        
        except TimeoutException as e:
            # Take a screenshot for debugging if there is an issue
            self.driver.save_screenshot("login_failure_screenshot.png")
            # Optionally, print the page source for debugging purposes
            print(self.driver.page_source)
            self.fail(f"Test failed due to timeout: {str(e)}")
     

    # 4. Test Logout
    def test_logout(self):
        # Ensure the user is logged in first
        self.login_user('visitor@dcp.com', 'visitor')

        # Click on the user menu (this opens the logout option)
        user_button = self.driver.find_element(By.CLASS_NAME, "cl-userButtonBox")
        user_button.click()

        # Find and click the Logout button in the menu
        logout_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign out')]"))
        )
        logout_button.click()

        # Verify that the Sign In button appears again after logging out
        sign_in_button = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//button[text()='Sign In']"))
        )
        self.assertTrue(sign_in_button.is_displayed(), "Sign In button did not reappear after logging out")

    # 6. Test Successful Booking
    def test_successful_booking(self):
        self.login_user('visitor@dcp.com', 'visitor')

        # Navigate to the Spots page
        self.driver.get("http://localhost:3000/spots")

        # Select the specific spot by locating the div containing 'Golden Skybridge'
        golden_skybridge_div = WebDriverWait(self.driver, 50).until(
            EC.visibility_of_element_located((By.XPATH, "//div[h2[text()='Golden Skybridge']]"))
        )

        # Find the 'Book Now' button within the identified div
        book_now_button = golden_skybridge_div.find_element(By.XPATH, ".//button[text()='Book Now']")
        book_now_button.click()

        # Wait for booking form to be visible before interacting
        booking_form = WebDriverWait(self.driver, 50).until(
            EC.visibility_of_element_located((By.XPATH, "//label[text()='Adults:']"))
        )
        # Updated XPaths to correctly locate the input fields
        adults_input = self.driver.find_element(By.XPATH, "//label[text()='Adults:']/following::input[@type='number'][1]")
        kids_input = self.driver.find_element(By.XPATH, "//label[text()='Kids (below 12):']/following::input[@type='number'][1]")
        booking_date_input = self.driver.find_element(By.XPATH, "//label[text()='Booking Date:']/following::input[@type='date'][1]")


        adults_input.clear()
        adults_input.send_keys("2")
        kids_input.clear()
        kids_input.send_keys("1")
        booking_date_input.clear()
        booking_date_input.send_keys("2024-12-31")

        # Adding a short wait to ensure the inputs are processed
        WebDriverWait(self.driver, 2)

        # Click on the 'Validation and Confirm Booking' button
        confirm_booking_button = self.driver.find_element(By.XPATH, "//button[text()='Validation and Confirm Booking']")
        confirm_booking_button.click()

        # Wait for the booking confirmation alert
        WebDriverWait(self.driver, 20).until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        self.assertIn("Booking confirmed!", alert.text, "Booking confirmation alert did not appear as expected.")
        alert.accept()

if __name__ == "__main__":
    unittest.main()
