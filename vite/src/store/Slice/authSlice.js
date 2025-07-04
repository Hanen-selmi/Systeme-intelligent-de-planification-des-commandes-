import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode'; // Import jwt_decode to decode the token

const tokenFromStorage = localStorage.getItem('token');
let decodedToken = null;

if (tokenFromStorage) {
  try {
    decodedToken = jwt_decode(tokenFromStorage); // Decode the token
  } catch (error) {
    console.error('Invalid token in localStorage:', error);
    localStorage.removeItem('token'); // Clear the invalid token
  }
}

const initialState = {
  token: tokenFromStorage || null,
  user: decodedToken ? { role: decodedToken.role, email: decodedToken.email } : null,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
