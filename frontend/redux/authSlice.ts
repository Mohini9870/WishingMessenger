import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";


//send otp
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ email }: { email: string }) => {
    const res = await api.post("/auth/send-otp", { email });
    return res.data;
  }
);

// verify otp and register user
export const verifyOtpAndRegister = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { email: string; otp: string; password: string }) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  }
);
// export const sendOtp = createAsyncThunk(
//   "auth/sendOtp",
//   async ({ email }: { email: string }) => {
//     await api.post("/auth/send-otp", { email });
//   }
// );

// export const verifyOtpAndRegister = createAsyncThunk(
//   "auth/verifyOtpRegister",
//   async (data: { email: string; otp: string; password: string }) => {
//     await api.post("/auth/verify-otp-register", data);
//   }
// );

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export default authSlice.reducer;





// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import api from "../services/api";

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   loading: false,
// };

// /* 🔐 LOGIN THUNK */
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (data: { email: string; password: string }) => {
//     const res = await api.post("/auth/login", data);
//     return res.data;
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
