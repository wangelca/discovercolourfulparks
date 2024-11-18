'use client';

import { useUser, SignedIn } from '@clerk/nextjs';
import { slide as Menu } from 'react-burger-menu';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faHeart, faStar, faTag, faInbox, faUsers, faTree, faCalendar, faMapMarkerAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import NotificationBubble from './notificationBubble';

export default function DrawerMenu() {
  const { user, isLoaded } = useUser(); // Check if user data is loaded
  const [menuOpen, setMenuOpen] = useState(false);

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
          src="/burger-bar.png"
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
        customCrossIcon={<FontAwesomeIcon icon={faTimes} size="2x" />}
      >
        {user && user.publicMetadata?.role === 'visitor' && (
          <>
            <a id="user-profile" className="menu-item text-white" href="/user-profile"><FontAwesomeIcon icon={faUser} />  Profile</a>
            <a className="menu-item text-white" href="/userreports/make-report" onClick={closeMenu}>
              <FontAwesomeIcon icon={faFileAlt} /> Make A Report
            </a>
            <a id="about" className="menu-item text-white" href="/">  <FontAwesomeIcon icon={faHeart} />  Favorite</a>
            <a className="menu-item text-white" href="/" onClick={closeMenu}><FontAwesomeIcon icon={faStar} />  Review</a>
            <a className="menu-item text-white" href="/" onClick={closeMenu}><FontAwesomeIcon icon={faTag} />  Coupons</a>
            <a className="menu-item text-white" href="/inbox" onClick={closeMenu}><FontAwesomeIcon icon={faInbox} />  Inbox <NotificationBubble menuOpen={menuOpen} /></a>
          </>
        )}

        {user && user.publicMetadata?.role === 'admin' && (
          <>
            <a className="menu-item text-white" href="/manage-user" onClick={closeMenu}><FontAwesomeIcon icon={faUsers} />  Manage Users</a>
            <a className="menu-item text-white" href="/manage-user-reports" onClick={closeMenu}><FontAwesomeIcon icon={faFileAlt} />  Manage User Reports</a>
            <a className="menu-item text-white" href="/manage-parks" onClick={closeMenu}><FontAwesomeIcon icon={faTree} />  Manage Parks</a>
            <a className="menu-item text-white" href="/manage-events" onClick={closeMenu}><FontAwesomeIcon icon={faCalendar} />  Manage Events</a>
            <a className="menu-item text-white" href="/manage-spots" onClick={closeMenu}><FontAwesomeIcon icon={faMapMarkerAlt} />  Manage Spots</a>
            <a className="menu-item text-white" href="/inbox" onClick={closeMenu}><FontAwesomeIcon icon={faInbox} />  Inbox <NotificationBubble menuOpen={menuOpen} /></a>
            <a className="menu-item text-white" href="/reports" onClick={closeMenu}><FontAwesomeIcon icon={faFileAlt} />  Generate Reports</a>
          </>
        )}
      </Menu>
    </SignedIn>
  );
}

