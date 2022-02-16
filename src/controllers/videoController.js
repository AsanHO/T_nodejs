let videos = [
  {
    title: "1vid",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "2vid",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "3vid",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];
//to globalRouter
export const trend = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
//to videoRouter
export const watch = (req, res) => {
  const { id } = req.params;
  //ㄴ const id = req.params.id; 링크에서 뽑는것
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload` });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  videos.push({
    title: title,
    rating: 0,
    comments: 0,
    createdAt: "now",
    views: 0,
    id: videos.length + 1,
  });
  return res.redirect("/");
};
