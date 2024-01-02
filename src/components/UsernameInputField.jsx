// UsernameInputField.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const UsernameInputField = ({ username, setUsername }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="form-control">
      <label className={`label ${isFocused || username ? 'label-active' : ''}`}>
        <span className="label-text">Username</span>
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Username"
        className="input input-bordered"
        required
      />
    </div>
  );
};

UsernameInputField.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};

export default UsernameInputField;
