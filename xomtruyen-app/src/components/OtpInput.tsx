import React from 'react';
import './OtpInput.css';

interface OtpInputProps {
  value: string;
  length: number;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, length }) => {
  // Pad the value with empty strings to match the length
  const digits = value.padEnd(length, ' ').split('');

  return (
    <div className="otp-input-container">
      {digits.map((digit, index) => (
        <div key={index} className={`otp-box ${digit !== ' ' ? 'filled' : ''} ${value.length === index ? 'active' : ''}`}>
          {digit !== ' ' ? digit : ''}
        </div>
      ))}
    </div>
  );
};

export default OtpInput;
