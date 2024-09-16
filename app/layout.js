  'use client'

  import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
  import './globals.css'
  import DrawerMenu from './components/drawer'


  export default function RootLayout({ children }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
            <header>
              {/* Sign-in button for users not logged in */}
              <SignedOut>
              </SignedOut>
              <SignedIn>
                <DrawerMenu />
              </SignedIn>
            </header>
            
            <main>{children}</main>
          </body>
        </html>
      </ClerkProvider>
    )
  }