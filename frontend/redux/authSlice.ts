import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import api from "../services/api";
import { saveToken, deleteToken } from "@/services/tokenStorage";
import { setAuthToken } from "../services/api";

/* =====================
   LOGIN
===================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  }
);

/* =====================
   FETCH ME
===================== */
export const fetchMe = createAsyncThunk(
  "auth/me",
  async () => {
    const res = await api.get("/auth/me");
    return res.data.user;
  }
);

/* =====================
   SEND OTP
===================== */
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ email }: { email: string }) => {
    const res = await api.post("/auth/send-otp", { email });
    return res.data;
  }
);

/* =====================
   VERIFY OTP + REGISTER
===================== */
export const verifyOtpAndRegister = createAsyncThunk(
  "auth/register",
  async (data: { email: string; otp: string; password: string }) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as any,
    token: null as string | null,
    loading: false,
    bootstrapped: false, // ⭐ VERY IMPORTANT
  },
  reducers: {
    restoreToken: (state, action) => {
      state.token = action.payload;
      state.bootstrapped = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      deleteToken();
      setAuthToken(null);
    },

  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        saveToken(action.payload.token);
         setAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })

      /* FETCH ME */
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        //  token clear mat karo
      });
     
  },
});
// async thunks

export const { logout, restoreToken} = authSlice.actions;

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
