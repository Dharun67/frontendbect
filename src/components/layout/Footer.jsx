import React from 'react';
import { Link } from 'react-router-dom';
import clgLogo from '../../assets/images/CLGLOGO.webp';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="fcol">
          <div className="footer-brand">
            <img src={clgLogo} alt="Logo" className="footer-logo" />
            <h3>Best Engineering College</h3>
          </div>
          <p>Quality technical education since 2016. NAAC Accredited with A Grade. Affiliated to Anna University, Chennai.</p>
          <div className="socials">
            <a href="https://facebook.com" className="social-fb" aria-label="Facebook">f</a>
            <a href="https://x.com" className="social-tw" aria-label="X">X</a>
            <a href="https://linkedin.com" className="social-li" aria-label="LinkedIn">in</a>
          </div>
        </div>
        <div className="fcol">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/departments">Departments</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/placements">Placements</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="fcol">
          <h4>Student Services</h4>
          <ul>
            <li><Link to="/student-login">Student Login</Link></li>
            <li><Link to="/portal">Student Portal</Link></li>
            <li><Link to="/facilities">Facilities</Link></li>
            <li><Link to="/departments">Examination Cell</Link></li>
            <li><Link to="/admissions">Scholarship</Link></li>
            <li><Link to="/facilities">Library</Link></li>
          </ul>
        </div>
        <div className="fcol">
          <h4>Contact Us</h4>
          <p>NH-48, Pennalur Village,<br />Sriperumbudur Taluk,<br />Kanchipuram - 602 117</p>
          <p>Phone : +91 44 2716 3000</p>
          <p>Email : admissions@bec.edu.in</p>
          <p>Mon - Sat : 9:00 AM - 5:00 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Best Engineering College. All Rights Reserved.</p>
        <p>
          <Link to="/privacy">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="/terms">Terms of Use</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
