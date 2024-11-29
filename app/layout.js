"use client";

import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import "./globals.css";
import DrawerMenu from "./components/drawer";
import Header from "./components/header";
import Footer from "./components/footer";
import BackToTopButton from "./components/scroll-back-button";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/main" signUpFallbackRedirectUrl="/main">
      <html lang="en">
        <body className="bg-top bg-fixed bg-cover bg-no-repeat bg-[url(/bg/FOREST_BACKGROUND6_generated.jpg)]">
          <SignedIn>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </SignedIn>
          <SignedOut>
          <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}

// Authenticated Layout Component
function AuthenticatedLayout({ children }) {
  const { user, isSignedIn } = useUser();

  return (
    <>
      <DrawerMenu user={user} />
      <Header user={user} isSignedIn={isSignedIn} />
      <BackToTopButton />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Unauthenticated Layout Component
function UnauthenticatedLayout({ children }) {
  return (
    <>
      <Header />
      <BackToTopButton />
      <main>{children}</main>
      <Footer />
    </>
  );
}
