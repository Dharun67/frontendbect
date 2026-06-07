import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/style.css';
import '../assets/css/portal-page.css';
import '../assets/css/professional.css';

function PortalPage() {
  const portals = [
    { title: 'Student Portal', desc: 'Access attendance, marks, timetable, assignments and fee payment', link: '/student-login' },
    { title: 'Faculty Portal', desc: 'Manage attendance, enter marks and upload assignments', link: '/faculty-login' },
    { title: 'Admin Portal', desc: 'Manage students, faculty, admissions and fees', link: '/admin-login' },
  ];

  return (
    <>
      <Navbar />
      <main className="portal-select-page">
        <section className="portal-select-header">
          <p>Online Access</p>
          <h2>College Portals</h2>
          <span>Select your role to access the portal</span>
        </section>

        <section className="portal-card-grid">
          {portals.map(p => (
          <div key={p.title} className="portal-role-card">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <Link to={p.link}>Login to Portal</Link>
          </div>
          ))}
        </section>

        <section className="portal-feature-section">
          <h3>Portal Features</h3>
          <div className="portal-feature-list">
          {[
            { title: 'Secure Access' },
            { title: 'Mobile Friendly' },
            { title: '24/7 Available' },
            { title: 'Support Available' }
          ].map((item) => (
            <div key={item.title} className="portal-feature-item">
              <p>{item.title}</p>
            </div>
          ))}
          </div>
        </section>

        <section className="links-section">
          <p className="section-tag center">Quick Access</p>
          <h2 className="sec-title">Important Links</h2>
          <p className="sec-sub">Access key portals and resources in one click</p>
          <div className="links-grid">

            <div className="link-card">
              <span className="link-label">Student</span>
              <h3>Student Portal</h3>
              <p>Check attendance, marks, timetable and fee details</p>
              <Link to="/student-login" className="link-btn">Login</Link>
            </div>

            <div className="link-card">
              <span className="link-label">Exam</span>
              <h3>Hall Ticket</h3>
              <p>Download your semester examination hall ticket here</p>
              <button className="link-btn" onClick={(e) => e.preventDefault()}>Download</button>
            </div>

            <div className="link-card">
              <span className="link-label">Results</span>
              <h3>Exam Results</h3>
              <p>View your semester results published by Anna University</p>
              <button className="link-btn" onClick={(e) => e.preventDefault()}>View Results</button>
            </div>

            <div className="link-card">
              <span className="link-label">Fee</span>
              <h3>Fee Payment</h3>
              <p>Pay your tuition and hostel fees online securely</p>
              <button className="link-btn" onClick={(e) => e.preventDefault()}>Pay Now</button>
            </div>

            <div className="link-card">
              <span className="link-label">Library</span>
              <h3>e-Library</h3>
              <p>Access digital books, journals and research papers</p>
              <button className="link-btn" onClick={(e) => e.preventDefault()}>Open</button>
            </div>

            <div className="link-card">
              <span className="link-label">Grievance</span>
              <h3>Grievance Cell</h3>
              <p>Submit complaints or concerns to the college committee</p>
              <button className="link-btn" onClick={(e) => e.preventDefault()}>Submit</button>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PortalPage;
