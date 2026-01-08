import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, {setAuthToken} from "../services/api";
import { saveToken, deleteToken } from "@/services/tokenStorage";


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
  "auth/verifyOtp",
  async (data: { email: string; otp: string; password: string }) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  }
);

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
   FETCH LOGGED IN USER
===================== */
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { getState }) => {
    const state: any = getState();
    const token = state.auth.token;

    const res = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.user;
  }
);

/* =====================
   SLICE
===================== */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as any,
    token: null as string | null,
    loading: false,
  },
  reducers: {
    setToken : (state, action)=>{
      state.token = action.payload;
    },
    tokenRestored: (state, action) => {
      state.token = action.payload;
      state.loading = false;
      setAuthToken(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      setAuthToken(null); 
       deleteToken();
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
        setAuthToken(action.payload.token);
        saveToken(action.payload.token);
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
        state.user = null;
        state.token = null;
        deleteToken();
      });
  },
});

export const { logout, tokenRestored, setToken } = authSlice.actions;
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
