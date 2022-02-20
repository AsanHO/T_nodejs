import mongoose from "mongoose";

//모델의 형태를 정의해줘야함 : 스키마
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createAt: Date,
  hashtag: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

//모델 선언
const Video = mongoose.model("Video", videoSchema);
export default Video;
