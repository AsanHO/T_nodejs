import User from "../models/User";
import Comment from "../models/Comment";
import Video from "../models/Video";

//to globalRouter
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
//to videoRouter
export const watch = async (req, res) => {
  const { id } = req.params;
  //ㄴ const id = req.params.id; 링크에서 뽑는것
  const video = await Video.findById(id).populate("owner").populate("comments");
  /*==% const video = await Video.findById(id);
  const owner = await User.findById(video.owner);*/
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not founded" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not founded" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `editing ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload` });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  console.log(video, thumb);
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    console.log(newVideo);
    console.log(_id);
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
    //"i"는 대소문자구별을 무효화시켜준다.
  }
  return res.render("search", { pageTitle: "search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const commentUser = await User.findById(user._id);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  commentUser.comments.push(comment._id);
  commentUser.save();
  video.save();
  req.session.user = commentUser; //
  return res.status(201).json({
    newCommentId: comment._id,
  });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    body: { videoId },
    session: { user },
  } = req;
  const video = await Video.findById(videoId);
  const commentUser = await User.findById(user._id);
  if (user.comments.indexOf(id) < 0) {
    req.flash("info", "Not authorized");
    return res.sendStatus(403);
  }
  commentUser.comments.splice(commentUser.comments.indexOf(id), 1);
  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await commentUser.save();
  await Comment.findByIdAndDelete(id);

  return res.sendStatus(201);
};
