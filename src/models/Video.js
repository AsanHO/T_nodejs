import mongoose from "mongoose";

//모델의 형태를 정의해줘야함 : 스키마
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, default: Date.now },
  hashtag: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

//모델 선언
const Video = mongoose.model("Video", videoSchema);
export default Video;
