import { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, InputLabel, OutlinedInput, FormHelperText, Typography, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import { useNavigate } from 'react-router-dom';


const RequestResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    setLoading(true);
    setErrorMessage(''); 
    setSuccessMessage(''); 
    try {

      await axios.post('http://localhost:5000/api/request-reset-password', { email: values.email });

     
      setSuccessMessage('A reset password link has been sent to your email.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      setErrorMessage('Email Not Fount  ');
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 15 }}>
   
      <Typography variant="h4" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
        Forgot Your Password?
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        Enter your email address below, and we'll send you a link to reset your password.
      </Typography>

      <Formik
        initialValues={{ email: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
           
            {errorMessage && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <ErrorOutlineIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography color="error">{errorMessage}</Typography>
              </Box>
            )}


            {successMessage && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="success.main">{successMessage}</Typography>
              </Box>
            )}

            <FormControl  color='secondary' fullWidth error={Boolean(touched.email && errors.email)} sx={{ mb: 2 }}>
              <InputLabel  color='secondary' htmlFor="email">Email Address</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
              />
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </FormControl>

            <Button type="submit" fullWidth variant="contained" color="secondary" disabled={isSubmitting || loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default RequestResetPassword;
