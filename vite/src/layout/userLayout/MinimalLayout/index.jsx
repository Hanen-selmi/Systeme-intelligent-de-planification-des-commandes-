import { Outlet } from 'react-router-dom';

// project imports
import Customization from '../adminLayout/Customization';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => (
  <>
    <Outlet />
    <Customization />
  </>
);

export default MinimalLayout;
