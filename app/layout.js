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
          <body className='bg-bottom bg-fixed  bg-cover bg-no-repeat bg-[url(/bg/6558736.jpg)]'>
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
            <main>{children}</main>
            <Footer/>
          </body>
        </html>
      </ClerkProvider>
    )
  }
