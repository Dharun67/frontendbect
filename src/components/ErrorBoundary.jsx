import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: '600px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}
            >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                <h1 style={{ color: '#0f172a', marginBottom: '15px', fontFamily: '"Inter", sans-serif' }}>Something went wrong.</h1>
                <p style={{ color: '#64748b', marginBottom: '30px', lineHeight: '1.6' }}>
                    The application encountered an unexpected error. Our team has been notified. 
                    Please try refreshing the page or returning to the home screen.
                </p>
                <button 
                    onClick={() => window.location.href = '/'}
                    style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                    Return to Home
                </button>
                {process.env.NODE_ENV !== 'production' && this.state.error && (
                    <div style={{ marginTop: '30px', textAlign: 'left', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
                        <p style={{ color: '#ef4444', fontWeight: 'bold', margin: '0 0 10px 0' }}>{this.state.error.toString()}</p>
                        <pre style={{ fontSize: '12px', color: '#334155', margin: 0 }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                )}
            </motion.div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
