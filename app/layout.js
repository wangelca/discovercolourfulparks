'use client'

import { ClerkProvider, SignedIn, SignedOut,  } from '@clerk/nextjs'
import './globals.css' 
import DrawerMenu from './components/drawer'
import Header from './components/header'
import Footer from './components/footer'
import BackToTopButton from './components/scroll-back-button'


  export default function RootLayout({ children }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
          <Header/>    
          <BackToTopButton/>      
            <header>
              {/* Sign-in button for users not logged in */}
              <SignedOut>
              </SignedOut>
              <SignedIn>
                <DrawerMenu />
              </SignedIn>
            </header>            
            <main className='bg-top bg-cover bg-no-repeat bg-[url(/bg/6558736.jpg)]'>{children}</main>
            <Footer/>
          </body>
        </html>
      </ClerkProvider>
    )
  }
