import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/style.css';

function TermsPage() {
  return (
    <>
      <Navbar />
      <div style={{ background: '#fff', margin: '20px 20px 20px', borderRadius: '35px', padding: '60px 60px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #ebebeb', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <span className="section-tag">Legal</span>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>Terms &amp; Conditions</h1>
        <span style={{ fontSize: '12px', color: '#aaa', marginBottom: '30px', display: 'block' }}>Last Updated: June 1, 2025</span>

        {[
          ['1. Acceptance of Terms', 'By accessing or using the Best Engineering College website and portals, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.'],
          ['2. Use of Website', 'You agree to use this website only for lawful purposes. You must not use the website in any way that violates applicable laws, attempt to gain unauthorized access, transmit unsolicited advertising material, impersonate any person, or engage in conduct that restricts others\'s use of the website.'],
          ['3. Student Portal Terms', 'Students who access the student portal agree to keep login credentials confidential, use the portal only for legitimate academic purposes, report any unauthorized access or security concerns immediately, and accept that all portal data reflects official college records.'],
          ['4. Admission Terms', 'Admission to Best Engineering College is subject to verification of all submitted documents. Any false information leads to immediate cancellation of admission. Compliance with TNEA counselling process, payment of fees as per schedule, and adherence to college code of conduct are mandatory.'],
          ['5. Fee Payment Terms', 'All fee payments are non-refundable except as per the college refund policy and UGC/Anna University guidelines. Any disputes regarding fees must be raised within 30 days of payment.'],
          ['6. Intellectual Property', 'All content on this website including text, images, logos, and course materials is the intellectual property of Best Engineering College. Unauthorized use, reproduction, or distribution is strictly prohibited.'],
          ['7. Governing Law', 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.'],
          ['8. Contact', 'For queries regarding these terms, contact us at: Email: legal@bec.edu.in | Phone: +91 44 2716 3000'],
        ].map(([title, text]) => (
          <div key={title}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', margin: '24px 0 10px' }}>{title}</h3>
            <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.9', marginBottom: '10px', fontWeight: '300' }}>{text}</p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default TermsPage;
