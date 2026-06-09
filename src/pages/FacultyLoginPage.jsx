import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clgLogo from '../assets/images/CLGLOGO.webp';
import { verifyLogin } from '../utils/storage';
import { useForm, useValidation } from '../hooks/useForm';
import { useApp } from '../context/AppContext';
import { FormInput, FormCheckbox, FormButton, FormMessage } from '../components/ui/FormComponents';
import '../assets/css/professional.css';
import '../assets/css/login.css';
import '../assets/css/portal-login.css';

function FacultyLoginPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const validation = useValidation();
  const form = useForm({ id: '', password: '', remember: false });
  const { setSessionUser, setSessionType } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    const idError = validation.validateRequired(form.values.id, 'Faculty ID or Email');
    if (idError) newErrors.id = idError;
    
    const passwordError = validation.validateRequired(form.values.password, 'Password');
    if (passwordError) newErrors.password = passwordError;

    form.setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    const result = await verifyLogin('faculty', form.values.id.trim(), form.values.password.trim());
    
    if (result.success) {
      setSessionUser(result.user);
      setSessionType('faculty');
      navigate('/faculty-portal');
    } else {
      setMessage({ type: 'error', text: 'Invalid credentials. Use demo: faculty / faculty123' });
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-card portal-login-card">
          <div className="portal-login-badge faculty-badge">Faculty Portal</div>
          <div className="login-logo">
            <img src={clgLogo} alt="BEC Logo" />
            <h2>Faculty Login</h2>
            <p>Enter your credentials to access the faculty portal</p>
          </div>
          <form onSubmit={handleSubmit}>
            <FormMessage type={message.type} message={message.text} />
            <FormInput
              label="Faculty ID / Email"
              name="id"
              value={form.values.id}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.id}
              touched={form.touched.id}
              placeholder="e.g. FAC-CSE-001 or faculty@bec.edu.in"
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
            <FormButton type="submit">Login to Faculty Portal</FormButton>
            <p className="switch-text">Not a faculty? <Link to="/portal" style={{ color: '#c9a84c', fontWeight: '600' }}>Back to Portal</Link></p>
          </form>
          <div className="demo-creds"><p>Demo: ID <strong>faculty</strong> | Password <strong>faculty123</strong></p></div>
        </div>
      </div>
    </>
  );
}

export default FacultyLoginPage;
