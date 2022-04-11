import User from "../models/User";
import fetch from "node-fetch";
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
  const user = await User.findOne({ username: username, socialOnly: false }); //=username하나만 써도 유효
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    //github가 요구하는 변수명과 같아야함
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      //이메일이 동일하거나 이미 github로 로그인했던 경우
    }
    //동일하지 않다면
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
//to userRouter
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  }); //double populate: 객체를 호출하는법(유저에서 비디오를 호출하고 호출한 비디오에서 또다시 유저를 호출)
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) =>
  res.render("edit-profile", { pageTitle: "Edit Profile" });
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  if (
    email === req.session.user.email &&
    username === req.session.user.username &&
    file === undefined
  ) {
    return res.status(400).render("edit-Profile", {
      pageTitle: "Edit Profile",
      errorMessage: `변경사항이 없습니다.`,
    });
  }
  //DB와 대조.
  const exsitsUsername = await User.findOne({ username });
  const exsitsEmail = await User.findOne({ email });
  if (
    (exsitsUsername && exsitsUsername._id != _id) ||
    (exsitsEmail && exsitsEmail._id != _id)
  ) {
    return res.status(400).render("edit-Profile", {
      pageTitle: "Edit Profile",
      errorMessage: `This username/email is already taken.`,
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    //이 코드가 실행되기 이전에, 1.자신의 정보와 중복되는지 검사, 2. DB의 정보와 중복되는지 검사
    _id,
    {
      avatarUrl: file ? file.location : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  ); //가장 최근에 변경된 object를 리턴하게해주는 mongoose code
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.status(400).render("edit-Profile", {
      pageTitle: "Edit Profile",
      errorMessage: `소셜로그인유저는 비밀번호변경이 불가능합니다.`,
    });
  }
  res.render("users/change-password", { pageTitle: "Change Profile" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPW, newPW, newPWConfirm },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPW, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (oldPW === newPW) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The old password equals new password",
    });
  }
  if (newPW !== newPWConfirm) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPW;
  await user.save();
  req.flash("info", "Password updated");
  req.session.destroy();
  return res.redirect("/login");
};
