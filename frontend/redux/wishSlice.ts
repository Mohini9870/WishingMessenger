import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";
import { getToken } from "@/services/tokenStorage";

/* ================= TYPES ================= */

export interface Wish {
  _id: string;
  receiverEmail: string;
  message: string;
  videoUrl?: string;
  sendAtUtc: string;
  status?: "PENDING" | "SENT" | "FAILED";
}

export interface AddWishInput {
  receiverEmail: string;
  message: string;
  date: string;
  time: string;
  videoUri?: string;
}

interface WishState {
  list: Wish[];
  loading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: WishState = {
  list: [],
  loading: false,
};

/* ================= ASYNC THUNKS ================= */

// ➕ ADD WISH
export const addWish = createAsyncThunk<Wish, AddWishInput>(
  "wishes/add",
  async (payload) => {
    const formData = new FormData();

    formData.append("receiverEmail", payload.receiverEmail);
    formData.append("message", payload.message);
    formData.append("date", payload.date);
    formData.append("time", payload.time);

    if (payload.videoUri) {
      const fileName = payload.videoUri.split("/").pop()!;
      formData.append("video", {
        uri: payload.videoUri,
        type: "video/mp4",
        name: fileName,
      } as any);
    }
    const token = await getToken();
    const res = await api.post("/wishes", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    })


    return res.data.data; // 👈 backend se new wish
  }
);

// 📄 FETCH MY WISHES
export const fetchWishes = createAsyncThunk<Wish[]>(
  "wishes/fetch",
  async () => {
    const res = await api.get("/wishes");
    return res.data.data;
  }
);

/* ================= SLICE ================= */

const wishSlice = createSlice({
  name: "wishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD
      .addCase(addWish.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWish.fulfilled, (state, action: PayloadAction<Wish>) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(addWish.rejected, (state) => {
        state.loading = false;
      })

      // FETCH
      .addCase(fetchWishes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishes.fulfilled, (state, action: PayloadAction<Wish[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchWishes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default wishSlice.reducer;








// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../services/api";

// /* 🔹 TYPES */
// export interface Wish {
//   _id: string;
//   name: string;
//   message: string;
//   scheduleDate: string;
// }

// interface WishState {
//   list: Wish[];
//   loading: boolean;
// }

// const initialState: WishState = {
//   list: [],
//   loading: false,
// };

// /* 🔹 THUNKS */
// export const fetchWishes = createAsyncThunk<Wish[]>(
//   "wishes/fetch",
//   async () => {
//     const res = await api.get("/wishes");
//     return res.data;
//   }
// );

// export const addWish = createAsyncThunk<Wish, Omit<Wish, "_id">>(
//   "wishes/add",
//   async (data) => {
//     const res = await api.post("/wishes", data);
//     return res.data;
//   }
// );

// /* 🔹 SLICE */
// const wishSlice = createSlice({
//   name: "wishes",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWishes.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchWishes.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })
//       .addCase(addWish.fulfilled, (state, action) => {
//         state.list.unshift(action.payload); // ✅ NO ERROR NOW
//       });
//   },
// });

// export default wishSlice.reducer;
