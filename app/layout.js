  'use client'

  import { ClerkProvider, SignedIn, SignedOut,  } from '@clerk/nextjs'
  import './globals.css'
  import DrawerMenu from './components/drawer'
  import Header from './components/header'


  export default function RootLayout({ children }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
          <Header/>
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
