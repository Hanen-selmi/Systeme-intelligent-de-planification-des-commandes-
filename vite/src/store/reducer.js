import { combineReducers } from 'redux';
import authSlice from './Slice/authSlice'
// reducer import
import customizationReducer from './customizationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authSlice,
});

export default reducer;
