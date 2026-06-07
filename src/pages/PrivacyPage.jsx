import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/style.css';

function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div style={{ background: '#fff', margin: '20px 20px 20px', borderRadius: '35px', padding: '60px 60px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #ebebeb', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <span className="section-tag">Legal</span>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>Privacy Policy</h1>
        <span style={{ fontSize: '12px', color: '#aaa', marginBottom: '30px', display: 'block' }}>Last Updated: June 1, 2025</span>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>1. Introduction</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>Best Engineering College ("BEC", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our portals.</p>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>2. Information We Collect</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>We may collect personal identification information (name, email address, phone number, date of birth), academic information (roll number, marks, attendance, department details), financial information (fee payment records), usage data (IP address, browser type, pages visited), and documents uploaded during admission (marksheets, certificates).</p>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>3. How We Use Your Information</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>We use the information we collect to process admissions and maintain academic records, communicate important college announcements, process fee payments, improve our services, and comply with legal obligations.</p>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>4. Data Security</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All portal logins are password-protected and data is transmitted over secure connections.</p>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>5. Your Rights</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us at <a href="mailto:privacy@bec.edu.in" style={{ color: '#c9a84c' }}>privacy@bec.edu.in</a>.</p>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>6. Contact Us</h3>
        <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>For any privacy-related concerns, please contact: Best Engineering College, NH-48, Pennalur Village, Kanchipuram – 602 117. Email: <a href="mailto:privacy@bec.edu.in" style={{ color: '#c9a84c' }}>privacy@bec.edu.in</a> | Phone: +91 44 2716 3000</p>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPage;
