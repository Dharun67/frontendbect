import React from 'react';

export const Input = ({ label, error, touched, ...props }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <input {...props} className={error && touched ? 'error' : ''} />
    {error && touched && <span className="error-text">{error}</span>}
  </div>
);

export const Select = ({ label, options, error, touched, ...props }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <select {...props} className={error && touched ? 'error' : ''}>
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
    {error && touched && <span className="error-text">{error}</span>}
  </div>
);

export const Textarea = ({ label, error, touched, ...props }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <textarea {...props} className={error && touched ? 'error' : ''} />
    {error && touched && <span className="error-text">{error}</span>}
  </div>
);

export const Button = ({ children, variant = 'primary', ...props }) => (
  <button className={`btn btn-${variant}`} {...props}>
    {children}
  </button>
);

export const Card = ({ title, children, className = '' }) => (
  <div className={`card ${className}`}>
    {title && <div className="card-header"><h3>{title}</h3></div>}
    <div className="card-body">{children}</div>
  </div>
);

export const StatCard = ({ icon, label, value, color = 'blue' }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-details">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export const Table = ({ columns, data, onRowClick }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ textAlign: 'center' }}>No data available</td></tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx} onClick={() => onRowClick && onRowClick(row)}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
