
// import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm.jsx';

const UploadImages = () => {


  return (
    <div className="max-w-4xl mx-auto">
      <Navbar />
      <UploadForm />
    </div>
  );
};

// UploadImages.propTypes = {
//   uid: PropTypes.string.isRequired,
// };

export default UploadImages;
