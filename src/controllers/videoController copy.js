//to globalRouter
export const trend = (req, res) => res.send("trendvideos");
export const search = (req, res) => res.send("search video");

//to videoRouter
export const see = (req, res) => {
  return res.send("see video");
};
export const edit = (req, res) => {
  res.send("edit video");
};
export const deletevideo = (req, res) => {
  res.send("deletevideo");
};
export const upload = (req, res) => res.send("upload video");
