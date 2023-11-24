import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    avatar: null, // Initialize with null
  });

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];
    if (uploadedImage) {
      setFormData({
        ...formData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setPreviewImage(fileReader.result);
      });
    }
  }

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      // Create a FormData object to send the image as part of the request
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('avatar', formData.avatar);

      register(formDataToSend);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label htmlFor="image_uploads" className="cursor-pointer">
          {previewImage ? (
            <img
              style={{ width: '150px', height: '150px', borderRadius: '50%', border: "1px solid black" }}
              src={previewImage}
              alt="previewImage"
            />
          ) : (
            <div style={{ width: '150px', height: '150px', borderRadius: '10px', overflow: 'hidden' }}>
              <i className="fas fa-image" style={{ fontSize: '150px' }}></i>
            </div>
          )}
        </label>
        <input
          type="file"
          // style={{ display: 'none' }}
          id="image_uploads"
          name="image_uploads"
          accept=".jpg, .jpeg, .png, .svg"
          onChange={getImage}
        />

        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
