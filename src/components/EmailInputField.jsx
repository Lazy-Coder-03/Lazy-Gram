// EmailInputField.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const EmailInputField = ({ email, setEmail }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="form-control">
      <label className={`label ${isFocused || email ? 'label-active' : ''}`}>
        <span className="label-text">Email</span>
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Email"
        className="input input-bordered"
        required
      />
    </div>
  );
};

EmailInputField.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};

export default EmailInputField;
