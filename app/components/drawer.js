'use client';

import { useUser, SignedIn } from '@clerk/nextjs';
import { slide as Menu } from 'react-burger-menu';
import { useState, useEffect } from 'react';

export default function DrawerMenu() {
  const { user, isLoaded } = useUser(); // Check if user data is loaded
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      console.log('User Object:', user);
    }
  }, [isLoaded, user]);
  

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  if (!isLoaded) {
    // While user data is being fetched, return null or a loading spinner
    return null;
  }

  

  return (
    <SignedIn>
      <div className="burger-icon" onClick={toggleMenu}>
        <img
          src="/burger-bar.png" // Replace with your icon image path
          alt="Menu Icon"
          style={{ width: '30px', height: '30px', cursor: 'pointer' }}
        />
      </div>

      <Menu
        isOpen={menuOpen}
        onStateChange={handleStateChange}
        left
        className="burger-menu"
        width={'250px'}
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        {user && user.publicMetadata.publicMetadata?.role === 'visitor' && (
          <>
            <a id="user-profile" className="menu-item text-white" href="/user-profile">Profile</a>
            <a id="about" className="menu-item text-white" href="/booking-hisotry">Booking History</a>
            <a className="menu-item text-white" href="/Inbox" onClick={closeMenu}>Inbox</a>
          </>
        )}

        {user && user.publicMetadata.publicMetadata?.role === 'admin' && (
          <>
            <a className="menu-item text-white" href="/user" onClick={closeMenu}>Manage Users</a>
            <a className="menu-item text-white" href="/manage-parks" onClick={closeMenu}>Manage Parks</a>
            <a className="menu-item text-white" href="/manage-events" onClick={closeMenu}>Manage Events</a>
            <a className="menu-item text-white" href="/manage-spots" onClick={closeMenu}>Manage Spots</a>
            <a className="menu-item text-white" href="/report" onClick={closeMenu}>Generate Reports</a>
          </>
        )}
      </Menu>
    </SignedIn>
  );
}
