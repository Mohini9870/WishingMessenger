import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

/* ================= TYPES ================= */




export interface Wish {
    _id: string;             // MongoDB id
  receiverEmail: string;
  message: string;
  videoUrl?: string;   // Backend video URL
  sendAtUtc: string;    // Backend UTC datetime
}

export interface AddWishInput {
  receiverEmail: string;
  message: string;
  date: string;
  time: string;
  videoUri?: string; // 👈 mobile ka video
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

export const addWish = createAsyncThunk<
  Wish,            // backend se jo aayega
  AddWishInput     // frontend se jo bhejenge
>("wishes/addWish", async (payload) => {
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

  const res = await api.post("/wishes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;   // Must contain _id, sendAtUtc, videoUrl
});


export const fetchWishes = createAsyncThunk<
  Wish[],      // return type
  void
>("wishes/fetchWishes", async () => {
  const res = await api.get("/wishes");
  return res.data.data;
});

/* ================= SLICE ================= */

const wishSlice = createSlice({
  name: "wishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWish.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWish.fulfilled, (state, action: PayloadAction<Wish>) => {
        state.loading = false;
        state.list.unshift(action.payload); // ✅ no TS error
      })
      .addCase(addWish.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchWishes.fulfilled, (state, action: PayloadAction<Wish[]>) => {
        state.list = action.payload;
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
