import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useForm, useValidation } from '../hooks/useForm';
import { FormInput, FormSelect, FormTextarea, FormButton, FormMessage, FormRow, FormColumn } from '../components/ui/FormComponents';
import { submitAdmissionsEnquiry } from '../utils/storage';
import '../assets/css/professional.css';

const ContactInfo = ({ icon, title, text }) => (
  <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '22px', padding: '22px', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
    <span style={{ fontSize: '26px', flexShrink: '0' }}>{icon}</span>
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px' }}>{title}</h4>
      <p style={{ fontSize: '12.5px', color: '#777', lineHeight: '1.75', fontWeight: '300', whiteSpace: 'pre-line' }}>{text}</p>
    </div>
  </div>
);

function ContactPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const validation = useValidation();
  const form = useForm({ first: '', last: '', email: '', phone: '', subject: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    const firstError = validation.validateRequired(form.values.first, 'First name');
    if (firstError) newErrors.first = firstError;
    
    const lastError = validation.validateRequired(form.values.last, 'Last name');
    if (lastError) newErrors.last = lastError;
    
    const emailError = validation.validateEmail(form.values.email);
    if (emailError) newErrors.email = emailError;
    
    const subjectError = validation.validateRequired(form.values.subject, 'Subject');
    if (subjectError) newErrors.subject = subjectError;
    
    const msgError = validation.validateRequired(form.values.msg, 'Message');
    if (msgError) newErrors.msg = msgError;

    form.setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const enquiryData = {
        name: `${form.values.first} ${form.values.last}`,
        email: form.values.email,
        phone: form.values.phone || '',
        subject: form.values.subject,
        message: form.values.msg,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        replied: false
      };
      await submitAdmissionsEnquiry(enquiryData);
      setMessage({ type: 'success', text: '✅ Your message has been sent! We\'ll get back to you within 24 hours.' });
      form.resetForm();
      setTimeout(() => setMessage({ type: '', text: '' }), 6000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const subjectOptions = [
    'Admission Enquiry',
    'Fee Related',
    'Academic Query',
    'Placement Information',
    'Hostel & Facilities',
    'Other'
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: '#fff', margin: '0 20px 20px', borderRadius: '35px', padding: '60px 50px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #ebebeb' }}>
        <span className="section-tag">Get In Touch</span>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#1a1a1a', margin: '12px 0 14px' }}>Contact Us</h2>
        <p style={{ fontSize: '15px', fontWeight: '300', color: '#666' }}>We'd love to hear from you. Reach out to us for admissions, academics or any general enquiry.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', margin: '0 20px 20px' }}>
        <div style={{ flex: '2', minWidth: '280px', background: '#fff', border: '1px solid #eee', borderRadius: '35px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', marginBottom: '22px' }}>Send us a Message</h3>
          <FormMessage type={message.type} message={message.text} />
          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormColumn>
                <FormInput
                  label="First Name *"
                  name="first"
                  value={form.values.first}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.errors.first}
                  touched={form.touched.first}
                  placeholder="First name"
                />
              </FormColumn>
              <FormColumn>
                <FormInput
                  label="Last Name *"
                  name="last"
                  value={form.values.last}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.errors.last}
                  touched={form.touched.last}
                  placeholder="Last name"
                />
              </FormColumn>
            </FormRow>
            <FormInput
              label="Email Address *"
              name="email"
              type="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.email}
              touched={form.touched.email}
              placeholder="your@email.com"
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={form.values.phone}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.phone}
              touched={form.touched.phone}
              placeholder="+91 XXXXX XXXXX"
            />
            <FormSelect
              label="Subject *"
              name="subject"
              value={form.values.subject}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.subject}
              touched={form.touched.subject}
              options={subjectOptions}
              placeholder="Select a subject"
            />
            <FormTextarea
              label="Message *"
              name="msg"
              value={form.values.msg}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.msg}
              touched={form.touched.msg}
              rows={5}
              placeholder="Type your message here..."
            />
            <FormButton type="submit" disabled={submitting}>{submitting ? '⏳ Sending...' : '📨 Send Message'}</FormButton>
          </form>
        </div>
        
        <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ContactInfo icon="📍" title="Address" text="NH-48, Pennalur Village, Sriperumbudur Taluk, Kanchipuram – 602 117, Tamil Nadu, India" />
          <ContactInfo icon="📞" title="Phone" text="+91 44 2716 3000\n+91 98765 43210" />
          <ContactInfo icon="📧" title="Email" text="info@bec.edu.in\nadmissions@bec.edu.in" />
          <ContactInfo icon="🕐" title="Working Hours" text="Monday – Saturday\n9:00 AM – 5:00 PM" />
          <ContactInfo icon="🎓" title="Admissions Office" text="admissions@bec.edu.in\n+91 98765 43211" />
        </div>
      </div>

      <div style={{ margin: '0 20px 20px', borderRadius: '35px', overflow: 'hidden', height: '360px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d79.9!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3OcKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 'none', display: 'block' }} allowFullScreen="" loading="lazy" title="map"></iframe>
      </div>
      <Footer />
    </>
  );
}

export default ContactPage;
