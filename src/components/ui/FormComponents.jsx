import React from 'react';

export const FormInput = ({ label, name, type = 'text', value, onChange, onBlur, error, touched, placeholder, ...props }) => {
  const inputStyle = {
    width: '100%',
    padding: '11px 18px',
    border: `1.5px solid ${error && touched ? '#c0392b' : '#e0e0e0'}`,
    borderRadius: '35px',
    fontSize: '13.5px',
    fontFamily: "'Poppins', sans-serif",
    background: '#fafafa',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div className="form-group">
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={inputStyle}
        {...props}
      />
      {error && touched && <span className="field-error" style={{ display: 'block', fontSize: '11.5px', color: '#c0392b', fontWeight: '500', marginTop: '5px', paddingLeft: '10px' }}>{error}</span>}
    </div>
  );
};

export const FormSelect = ({ label, name, value, onChange, onBlur, error, touched, options, placeholder = 'Select...', ...props }) => {
  const selectStyle = {
    width: '100%',
    padding: '11px 18px',
    border: `1.5px solid ${error && touched ? '#c0392b' : '#e0e0e0'}`,
    borderRadius: '35px',
    fontSize: '13.5px',
    fontFamily: "'Poppins', sans-serif",
    background: '#fafafa',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div className="form-group">
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={selectStyle}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
      {error && touched && <span className="field-error" style={{ display: 'block', fontSize: '11.5px', color: '#c0392b', fontWeight: '500', marginTop: '5px', paddingLeft: '10px' }}>{error}</span>}
    </div>
  );
};

export const FormTextarea = ({ label, name, value, onChange, onBlur, error, touched, placeholder, rows = 4, ...props }) => {
  const textareaStyle = {
    width: '100%',
    padding: '11px 18px',
    border: `1.5px solid ${error && touched ? '#c0392b' : '#e0e0e0'}`,
    borderRadius: '18px',
    fontSize: '13.5px',
    fontFamily: "'Poppins', sans-serif",
    background: '#fafafa',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical'
  };

  return (
    <div className="form-group">
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        style={textareaStyle}
        {...props}
      />
      {error && touched && <span className="field-error" style={{ display: 'block', fontSize: '11.5px', color: '#c0392b', fontWeight: '500', marginTop: '5px', paddingLeft: '10px' }}>{error}</span>}
    </div>
  );
};

export const FormCheckbox = ({ label, name, checked, onChange, error, touched, ...props }) => {
  return (
    <div className="form-group">
      <label className="check-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#555' }}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          style={{ width: '15px', height: '15px', accentColor: '#c9a84c' }}
          {...props}
        />
        {label}
      </label>
      {error && touched && <span className="field-error" style={{ display: 'block', fontSize: '11.5px', color: '#c0392b', fontWeight: '500', marginTop: '5px', paddingLeft: '10px' }}>{error}</span>}
    </div>
  );
};

export const FormRow = ({ children, gap = '14px' }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap, marginBottom: '16px' }}>
      {children}
    </div>
  );
};

export const FormColumn = ({ children, flex = '1', minWidth = '200px' }) => {
  return (
    <div style={{ flex, minWidth }}>
      {children}
    </div>
  );
};

export const FormButton = ({ children, type = 'submit', variant = 'primary', ...props }) => {
  const baseStyle = {
    border: 'none',
    borderRadius: '35px',
    padding: '13px 36px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s'
  };

  const variants = {
    primary: {
      background: '#c9a84c',
      color: '#fff'
    },
    secondary: {
      background: 'transparent',
      color: '#333',
      border: '2px solid #ddd'
    }
  };

  return (
    <button type={type} style={{ ...baseStyle, ...variants[variant] }} {...props}>
      {children}
    </button>
  );
};

export const FormMessage = ({ type, message }) => {
  const styles = {
    success: {
      background: 'rgba(201,168,76,0.1)',
      color: '#7a6020',
      border: '1px solid rgba(201,168,76,0.35)'
    },
    error: {
      background: 'rgba(192,57,43,0.1)',
      color: '#c0392b',
      border: '1px solid rgba(192,57,43,0.35)'
    }
  };

  if (!message) return null;

  return (
    <div style={{
      ...styles[type],
      padding: '11px 18px',
      borderRadius: '35px',
      fontSize: '13px',
      fontWeight: '500',
      marginBottom: '16px'
    }}>
      {message}
    </div>
  );
};
