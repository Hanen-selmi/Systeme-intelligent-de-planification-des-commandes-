import { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLocation, useNavigate } from 'react-router-dom'; 

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [token, setToken] = useState('');
  const navigate = useNavigate();


  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    setToken(token);  
  }, [location]);

  const handleClickShowPassword = (type) => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    setLoading(true);
    try {
      if (!token) {
        setErrors({ submit: 'No token provided in the URL' });
        return;
      }

      await axios.post('http://localhost:5000/api/change-password', {
        token, 
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setSuccessMessage('Your password has been successfully updated.');

     
      setTimeout(() => {
        navigate('/auth/login'); 
      }, 2000);  
    } catch (error) {
      setErrors({ submit: 'Failed to change password. Please try again.' });
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 15 }}>
     
      <Typography variant="h4" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
        Change Password
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        Please enter your new password below to update your account security.
      </Typography>

      <Formik
        initialValues={{ newPassword: '', confirmPassword: '', submit: null }}
        validationSchema={Yup.object().shape({
          newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(255, 'Password is too long')
            .required('New password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Confirm password is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {errors.submit && (
              <Box sx={{ mb: 2 }}>
                <FormHelperText error>
                  <ErrorOutlineIcon sx={{ mr: 1 }} />
                  {errors.submit}
                </FormHelperText>
              </Box>
            )}
            {successMessage && (
              <Box sx={{ mb: 2 }}>
                <Typography color="success.main">{successMessage}</Typography>
              </Box>
            )}
            <FormControl  color='secondary' fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ mb: 2 }}>
              <InputLabel  color='secondary' htmlFor="newPassword">New Password</InputLabel>
              <OutlinedInput
                id="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={values.newPassword}
                name="newPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => handleClickShowPassword('new')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.new ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
              />
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error>{errors.newPassword}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={Boolean(touched.confirmPassword && errors.confirmPassword)} sx={{ mb: 2 }}>
              <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={values.confirmPassword}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => handleClickShowPassword('confirm')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.confirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error>{errors.confirmPassword}</FormHelperText>
              )}
            </FormControl>
            <Button type="submit" fullWidth variant="contained" color="secondary" disabled={isSubmitting || loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ChangePassword;
