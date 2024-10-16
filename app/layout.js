"use client"; // Mark this component as a Client Component

import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import './globals.css'; 
import DrawerMenu from './components/drawer';
import Header from './components/header';
import Footer from './components/footer';
import BackToTopButton from './components/scroll-back-button';
import { BookingProvider } from './context/BookingContext'; // Import the BookingProvider

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <BookingProvider>
                <html lang="en">
                    <body className='bg-top bg-fixed bg-cover bg-no-repeat bg-[url(/bg/FOREST_BACKGROUND6_generated.jpg)]'>
                        <Header />
                        <BackToTopButton />
                        <header>
                            <SignedOut>
                                {/* You can add a sign-in button or prompt here */}
                            </SignedOut>
                            <SignedIn>
                                <DrawerMenu />
                            </SignedIn>
                        </header>
                        <main>{children}</main>
                        <Footer />
                    </body>
                </html>
            </BookingProvider>
        </ClerkProvider>
    );
}
