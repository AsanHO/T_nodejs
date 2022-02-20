import Video from "../models/Video";

//to globalRouter
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
//to videoRouter
export const watch = (req, res) => {
  const { id } = req.params;
  //ㄴ const id = req.params.id; 링크에서 뽑는것
  return res.render("watch", { pageTitle: `watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload` });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};
