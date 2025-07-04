import { createBrowserRouter } from 'react-router-dom';

// routes
import AdminRoutes from './AdminRoutes';
import LoginRoutes from './AuthenticationRoutes';
import UserRoutes from './User';
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([AdminRoutes, LoginRoutes,UserRoutes], {
  basename: '/'
});

export default router;
