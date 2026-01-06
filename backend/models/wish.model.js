import mongoose from "mongoose";

const wishSchema = new mongoose.Schema(
  {
    receiverEmail: { type: String, required: true },
    message: { type: String, required: true },
    videoUrl: { type: String },
    sendAtUtc: { type: Date, required: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Wish = mongoose.model("Wish", wishSchema);
export default Wish;








// import mongoose from "mongoose";

// const wishSchema = new mongoose.Schema(
//   {
//     receiverEmail: String,
//     message: String,
//     videoUrl: String,

//     // new add code for video, name scheduled date

//     name:{ type: String, required: true},

//     sendAtUtc: {
//       type: Date,
//       required: true,
//       index: true,
//     },
//      timezone:{
//         type: String,
//         default: "Asia/Kolkata"
//      },
//     status: {
//       type: String,
//       enum: ["PENDING", "SENT", "FAILED"],
//       default: "PENDING",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Wish", wishSchema);
