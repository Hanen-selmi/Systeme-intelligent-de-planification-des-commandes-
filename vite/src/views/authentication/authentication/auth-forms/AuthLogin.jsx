import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { login } from '../../../../store/Slice/authSlice';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; 

// jQuery for animations
import $ from 'jquery';
import './style.css';

const AuthLogin = ({ ...others }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values, { setErrors, setSubmitting }) => {
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8000/login', {
        email: values.email,
        password: values.password,
      });
      console.log('Login successful:', response.data);
      const token = response.data.access_token;
      const decodedToken = jwt_decode(token); 
      const user = { role: decodedToken.role, email: decodedToken.sub, statue: decodedToken.statue,firstname:decodedToken.firstname,lastname:decodedToken.lastname };
console.log(user)
      // Vérification du statut de l'utilisateur
     if (user.statue === 'bloqué') {
  setErrors({ submit: 'Votre compte n\'a pas encore été approuvé. Veuillez attendre l\'approbation de l\'administrateur.' });
  setLoading(false);
  return;
}

      // Poursuivre la connexion pour les utilisateurs approuvés
      dispatch(login({ token, user }));

      // Redirection en fonction du rôle de l'utilisateur
      if (decodedToken.role === 'admin') {
        navigate('/dashboard');
      } else if (decodedToken.role === 'user') {
        navigate('/dashboard-user'); 
      } else {
        console.error('Unknown role:', decodedToken.role);
        setErrors({ submit: 'Le rôle de l\'utilisateur n\'est pas reconnu.' });
      }

      setTimeout(() => {
        setLoading(false); 
      }, 2000);

    } catch (error) {
      setTimeout(() => {
        setLoading(false); 
        setErrors({ submit: 'Identifiant ou mot de passe incorrect' }); 
        $('.MuiFormControl-root').addClass('shake');
        setTimeout(() => {
          $('.MuiFormControl-root').removeClass('shake');
        }, 1000);

       
        $('#login-button').addClass('slide-active');
        setTimeout(() => {
          $('#login-button').removeClass('slide-active');
        }, 2000);
      }, 2000);
      console.error('Login failed:', error.response ? error.response.data : error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
        Login
      </Typography>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Doit être un email valide').max(255).required('L\'email est requis'),
          password: Yup.string().max(255).required('Le mot de passe est requis'),
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText
                  error
                  sx={{
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ErrorOutlineIcon sx={{ mr: 1 }} /> {errors.submit}
                </FormHelperText>
              </Box>
            )}

            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel  color='secondary' htmlFor="outlined-adornment-email-login">Email Address </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address "
                color='secondary'
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                  sx={{
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ErrorOutlineIcon sx={{ mr: 1 }} /> {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl  color='secondary' fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel  color='secondary' htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                  sx={{
                    padding: '8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ErrorOutlineIcon sx={{ mr: 1 }} /> {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                label="Remember me"
              />
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigate('/auth/rest')}>
                Forgot Password?
              </Typography>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  id="login-button"
                  disableElevation
                  disabled={isSubmitting || loading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
