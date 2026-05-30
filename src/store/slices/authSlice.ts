import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../types";
import { decodeJWT } from "../../utils/jwt";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: UserRole | null;
  username: string | null;
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      return {
        isAuthenticated: true,
        token,
        role: decoded.role,
        username: decoded.sub,
      };
    }
    localStorage.removeItem("token");
  }
  return { isAuthenticated: false, token: null, role: null, username: null };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const decoded = decodeJWT(token);
      if (decoded) {
        state.isAuthenticated = true;
        state.token = token;
        state.role = decoded.role;
        state.username = decoded.sub;
        localStorage.setItem("token", token);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.username = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
