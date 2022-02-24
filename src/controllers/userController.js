import User from "../models/User";
//to rootRouter
export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({
    $or: [{ username }, { email }],
    //=$or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  await User.create({
    email,
    username,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
export const login = (req, res) => res.send("login");

//to userRouter
export const see = (req, res) => res.send("see");
export const logout = (req, res) => res.send("logout");
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
