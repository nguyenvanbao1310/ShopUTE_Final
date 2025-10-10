import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import locationReducer from "./locationSlice";
import addressReducer from "./addressSlice";
const preloadedState = {
  auth: {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"), // token từ localStorage
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
    pendingRegToken: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
 	  location: locationReducer,
    address: addressReducer,  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
