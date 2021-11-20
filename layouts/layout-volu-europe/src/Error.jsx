import React from 'react';
import './Error.css';

const Error = ({ message, isStatus }) => {
  return (
    <div className="Error--Container">
      <div className="Error--Background" style={isStatus ? { fontSize: 11 } : {}}>
        <pre style={{ maxWidth: '100vw' }}>
          {message}
        </pre>
      </div>
    </div>
  );
}

export default Error;