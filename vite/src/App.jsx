import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import router from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/adminLayout/NavigationScroll';

// ==============================|| APP ||============================== //
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './store/Slice/authSlice';

const App = () => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(login({ token }));  // Dispatch the login action if token exists
    }
  }, [dispatch]);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <RouterProvider router={router} />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
