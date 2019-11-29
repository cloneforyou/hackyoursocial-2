import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PasswordEmailForm = ({ setAlert, isAuthenticated }) => {
  const [formData, setFormData] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = e => setFormData({ ...formData, email: e.target.value });
  const onSubmit = async e => {
    try {
      e.preventDefault();

      //  send email
      const reqConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const reqBody = JSON.stringify({ email: formData.email });

      const res = await axios.put(`/api/auth/forgot-password`, reqBody, reqConfig);
      setAlert(res.data.msg, 'success');
      setSent(true);
    } catch (err) {
      console.error(err);
      const { errors } = err.response.data;
      if (errors) {
        errors.forEach(error => setAlert(error.msg, 'danger'));
      }
    }
  };
  if (sent) {
    return (
      <Fragment>
        <h1 className='large text-primary'>Reset password email is sent.</h1>
        <p className='lead'>
          <i className='fas fa-mail'></i> Check your email: {formData.email}
        </p>
      </Fragment>
    );
  }

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Forgot Password</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Enter your user account's verified email address and we will
        send you a password reset link.
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            onChange={e => onChange(e)}
            required
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Send' />
      </form>
    </Fragment>
  );
};

PasswordEmailForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert })(PasswordEmailForm);
