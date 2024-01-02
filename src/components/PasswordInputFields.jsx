
import PropTypes from 'prop-types';

const PasswordInputFields = ({
  showPassword,
  handleTogglePassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="input input-bordered"
          required
        />
      </div>
      <div className="flex items-center mt-2 gap-4">
        <label className="label gap-4">
          <input
            type="checkbox"
            className="checkbox"
            onChange={handleTogglePassword}
          />
          <span className="label-text-alt ml-15">Show Password</span>
        </label>
      </div>
    </>
  );
};

PasswordInputFields.propTypes = {
  showPassword: PropTypes.bool.isRequired,
  handleTogglePassword: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  setConfirmPassword: PropTypes.func.isRequired,
};

export default PasswordInputFields;
