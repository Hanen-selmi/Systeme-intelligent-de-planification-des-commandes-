import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const store = configureStore({
  reducer,
  reducer:{
    auth: authSlice,
  },
 

});

export default store;