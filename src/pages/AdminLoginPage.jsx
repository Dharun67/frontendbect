import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import clgLogo from '../assets/images/CLGLOGO.webp';
import { verifyLogin, setLoggedInUser } from '../utils/storage';
import { useForm, useValidation } from '../hooks/useForm';
import { FormInput, FormCheckbox, FormButton, FormMessage } from '../components/ui/FormComponents';
import '../assets/css/professional.css';
import '../assets/css/login.css';
import '../assets/css/portal-login.css';

function AdminLoginPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const validation = useValidation();
  const form = useForm({ id: '', password: '', remember: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    const idError = validation.validateRequired(form.values.id, 'Admin ID or Email');
    if (idError) newErrors.id = idError;
    
    const passwordError = validation.validateRequired(form.values.password, 'Password');
    if (passwordError) newErrors.password = passwordError;

    form.setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    const result = await verifyLogin('admin', form.values.id.trim(), form.values.password.trim());
    
    if (result.success) {
      setLoggedInUser('admin', result.user);
      navigate('/admin-portal');
    } else {
      setMessage({ type: 'error', text: 'Invalid credentials. Use demo: admin / admin123' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-card portal-login-card">
          <div className="portal-login-badge admin-badge">Admin Portal</div>
          <div className="login-logo">
            <img src={clgLogo} alt="BEC Logo" />
            <h2>Admin Login</h2>
            <p>Enter your credentials to access the admin portal</p>
          </div>
          <form onSubmit={handleSubmit}>
            <FormMessage type={message.type} message={message.text} />
            <FormInput
              label="Admin ID / Email"
              name="id"
              value={form.values.id}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.id}
              touched={form.touched.id}
              placeholder="e.g. admin or admin@bec.edu.in"
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.password}
              touched={form.touched.password}
              placeholder="Enter your password"
            />
            <div className="form-row">
              <FormCheckbox
                label="Remember me"
                name="remember"
                checked={form.values.remember}
                onChange={form.handleChange}
              />
              <button type="button" className="forgot-link" onClick={() => setMessage({ type: 'error', text: 'Please contact the admin office to reset your password.' })}>Forgot Password?</button>
            </div>
            <FormButton type="submit">Login to Admin Portal</FormButton>
            <p className="switch-text">Not an admin? <Link to="/portal" style={{ color: '#c9a84c', fontWeight: '600' }}>Back to Portal</Link></p>
          </form>
          <div className="demo-creds"><p>Demo: ID <strong>admin</strong> | Password <strong>admin123</strong></p></div>
        </div>
      </div>
      <div className="login-footer">
        <p>&copy; 2025 Best Engineering College. All Rights Reserved.</p>
        <p><Link to="/privacy">Privacy Policy</Link> &nbsp;|&nbsp; <Link to="/terms">Terms of Use</Link></p>
      </div>
    </>
  );
}

export default AdminLoginPage;
