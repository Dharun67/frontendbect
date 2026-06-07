import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clgLogo from '../../assets/images/CLGLOGO.png';

function Navbar() {
  const { pathname } = useLocation();
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  const togglePortalDropdown = () => {
    setShowPortalDropdown(!showPortalDropdown);
  };

  return (
    <>
      <div className="top-strip">
        <span>Phone : +91 98765 43210</span>
        <span>Email : info@bec.edu.in</span>
      </div>
      <nav className="navbar">
        <div className="nav-left">
          <img src={clgLogo} alt="BEC Logo" className="nav-logo" />
          <div className="nav-title">
            <h1>Best Engineering College</h1>
            <p>Autonomous | Affiliated to Anna University</p>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/departments" className={pathname === '/departments' ? 'active' : ''}>Departments</Link>
          <Link to="/admissions" className={pathname === '/admissions' ? 'active' : ''}>Admissions</Link>
          <Link to="/placements" className={pathname === '/placements' ? 'active' : ''}>Placements</Link>
          
          <div className="portal-dropdown-wrapper">
            <Link to="/portal" onClick={togglePortalDropdown} className={pathname.includes('portal') || pathname.includes('login') ? 'active portal-link' : 'portal-link'}>Portal</Link>
            {showPortalDropdown && (
              <div className="portal-dropdown show">
                <Link to="/portal" onClick={() => setShowPortalDropdown(false)}>All Portals</Link>
                <Link to="/student-login" onClick={() => setShowPortalDropdown(false)}>Student Portal</Link>
                <Link to="/faculty-login" onClick={() => setShowPortalDropdown(false)}>Faculty Portal</Link>
                <Link to="/admin-login" onClick={() => setShowPortalDropdown(false)}>Admin Portal</Link>
              </div>
            )}
          </div>

          <Link to="/contact" className="nav-btn">Contact Us</Link>
          <Link to="/login" className="nav-btn" style={{ background: '#2c5282' }}>Login</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
