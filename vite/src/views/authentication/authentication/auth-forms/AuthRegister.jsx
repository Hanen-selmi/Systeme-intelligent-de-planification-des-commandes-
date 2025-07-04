import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert'; // Import Alert component
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { Select, MenuItem } from '@mui/material'; // Import necessary components
const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [message, setMessage] = useState(null); // Message state for success or error
  const [alertType, setAlertType] = useState(''); // Alert type: success or error

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  return (
    <Box {...others} sx={{ padding: 0 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
        Register
      </Typography>

      {message && (
        <Alert severity={alertType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Formik
       initialValues={{
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  address: '',
  date_naissance: '',
  role: '',
  password: '',
  submit: null,
}}

        validationSchema={Yup.object().shape({
          firstname: Yup.string().required('First Name is required'),
          lastname: Yup.string().required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').required('Email is required'),
          phone: Yup.string()
            .matches(/^\d{8}$/, 'Phone number must be exactly 8 digits')
            .required('Phone number is required'),
          address: Yup.string().required('Address is required'),
          date_naissance: Yup.date().required('Date of Birth is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          role: Yup.string().required('Role is required'), // Add validation for role
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axios.post('http://localhost:8000/register', values);
            setMessage('User registered successfully!');
            setAlertType('success');
            setSubmitting(false);

            // Redirect to login page after 2 seconds
            setTimeout(() => {
              navigate('/auth/login'); // Redirect using navigate
            }, 2000);
          } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred while registering.');
            setAlertType('error');
            setErrors({ submit: error.response?.data?.message || 'An error occurred while registering.' });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={matchDownSM ? 0 : 4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="firstname"
                  value={values.firstname}
                  onBlur={handleBlur}
                   color='secondary'
                  onChange={handleChange}
                  error={Boolean(touched.fname && errors.fname)}
                  helperText={touched.fname && errors.fname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="lastname"
                  value={values.lastname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.lname && errors.lname)}
                  helperText={touched.lname && errors.lname}
                   color='secondary'
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
               color='secondary'
              name="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
   <Grid container spacing={matchDownSM ? 0 : 2}>
   <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              name="phone"
               color='secondary'
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              margin="normal"
              name="address"

               color='secondary'
              value={values.address}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />
             </Grid>
          </Grid>
            <TextField
              fullWidth
              label="Date of Birth"
              margin="normal"
              name="date_naissance"
              type="date"
               color='secondary'
              value={values.date_naissance}
              onBlur={handleBlur}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={Boolean(touched.dob && errors.dob)}
              helperText={touched.dob && errors.dob}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel  color='secondary'>Role</InputLabel>
              <Select
                name="role"
                 color='secondary'
                value={values.role}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.role && errors.role)}
              >
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="user">Utilisateur</MenuItem>
              </Select>
              {touched.role && errors.role && (
                <FormHelperText>{errors.role}</FormHelperText>
              )}
            </FormControl>
            <FormControl  fullWidth sx={{ mt: '10px' }} error={Boolean(touched.password && errors.password)}>
              <InputLabel  color='secondary'>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                 color='secondary'
                value={values.password}
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton  color='secondary' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && <FormHelperText>{errors.password}</FormHelperText>}
            </FormControl>

            {strength !== 0 && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box
                      style={{ backgroundColor: level?.color }}
                      sx={{ width: 85, height: 8, borderRadius: '7px' }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{level?.label}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    Terms and Conditions
                  </Link>
                </Typography>
              }
            />

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button type="submit" variant="contained" color="secondary" fullWidth disabled={isSubmitting}>
                  Sign Up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthRegister;
