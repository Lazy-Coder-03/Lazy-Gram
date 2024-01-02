// FullnameInputField.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const FullnameInputField = ({ fullName, setFullName }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="form-control">
      <label className={`label ${isFocused || fullName ? 'label-active' : ''}`}>
        <span className="label-text">Full Name</span>
      </label>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Full Name"
        className="input input-bordered"
        required
      />
    </div>
  );
};

FullnameInputField.propTypes = {
  fullName: PropTypes.string.isRequired,
  setFullName: PropTypes.func.isRequired,
};

export default FullnameInputField;
