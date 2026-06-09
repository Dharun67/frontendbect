import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import clgLogo from '../assets/images/CLGLOGO.webp';
import { useForm } from '../hooks/useForm';
import { useApp } from '../context/AppContext';
import { FormInput, FormButton, FormMessage } from '../components/ui/FormComponents';
import { verifyLogin, setLoggedInUser } from '../utils/storage';
import '../assets/css/professional.css';
import '../assets/css/login.css';

function LoginPage() {
  const [siMsg, setSiMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { setSessionUser, setSessionType } = useApp();

  const signInForm = useForm({ userType: 'student', userId: '', password: '' });

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signInForm.values.userId.trim()) newErrors.userId = 'User ID is required';
    if (!signInForm.values.password) newErrors.password = 'Password is required';

    signInForm.setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSiMsg({ type: '', text: '' });
    const result = await verifyLogin(
      signInForm.values.userType,
      signInForm.values.userId.trim(),
      signInForm.values.password
    );

    if (!result || !result.success) {
      setSiMsg({ type: 'error', text: result?.message || 'Incorrect credentials. Please try again.' });
      return;
    }

    setLoggedInUser(result.type, result.user);
    setSessionUser(result.user);
    setSessionType(result.type);

    setSiMsg({ type: 'success', text: `Login successful! Welcome. Redirecting...` });
    setTimeout(() => {
      if (result.type === 'admin') navigate('/admin-portal');
      else if (result.type === 'faculty') navigate('/faculty-portal');
      else navigate('/student-portal');
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-logo">
            <img src={clgLogo} alt="BEC Logo" />
            <h2>Best Engineering College</h2>
            <p>Autonomous | Affiliated to Anna University</p>
          </div>

          <form onSubmit={handleSignIn}>
            <FormMessage type={siMsg.type} message={siMsg.text} />
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#555', display: 'block', marginBottom: '6px' }}>Login As</label>
              <select
                name="userType"
                value={signInForm.values.userType}
                onChange={signInForm.handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', background: '#fafafa' }}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <FormInput
              label="User ID / Roll No / Employee ID"
              name="userId"
              type="text"
              value={signInForm.values.userId}
              onChange={signInForm.handleChange}
              onBlur={signInForm.handleBlur}
              error={signInForm.errors.userId}
              touched={signInForm.touched.userId}
              placeholder="Enter your ID"
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={signInForm.values.password}
              onChange={signInForm.handleChange}
              onBlur={signInForm.handleBlur}
              error={signInForm.errors.password}
              touched={signInForm.touched.password}
              placeholder="Enter your password"
            />
            <div className="form-row">
              <button type="button" className="forgot-link" onClick={() => setSiMsg({ type: 'error', text: 'Please contact the admin office to reset your password.' })}>Forgot Password?</button>
            </div>
            <FormButton type="submit">Sign In</FormButton>
          </form>

        </div>
      </div>
      <div className="login-footer">
        <p>&copy; 2025 Best Engineering College. All Rights Reserved.</p>
        <p><Link to="/privacy">Privacy Policy</Link> &nbsp;|&nbsp; <Link to="/terms">Terms of Use</Link></p>
      </div>
    </>
  );
}

export default LoginPage;
