import { render } from "express/lib/response";
import User from "../models/User";
import bcrypt from "bcrypt";
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
  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return (
      res.status(400),
      render("join", {
        pageTitle,
        errorMessage: error._message,
      })
    );
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "login";
  // 사용자가 입력한 username이 DB에도 있는지 확인
  const user = await User.findOne({ username: username }); //=username하나만 써도 유효
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 유저이름입니다~~",
    });
  }
  // 비밀번호 유효성 체크
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호 틀렸쥬?",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

//to userRouter
export const see = (req, res) => res.send("see");
export const logout = (req, res) => res.send("logout");
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
