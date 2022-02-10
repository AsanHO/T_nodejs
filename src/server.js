import express from "express";
import res from "express/lib/response";

const PORT = 4000;

const app = express();

const testMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if(url === "/private") {
        return res.send("<h1>접근불가</h1>");
    };
    console.log(`${url}로 접근허용`);
    next();
};

const handlehome = (req, res) => {
    return res.send("Hello world");
};

const handlelogin = (req, res) => {
    return res.send("login here");
};

const privatepage = (req, res) => {
    return res.send("welcome to my private lounge");
};

app.use(testMiddleware);
app.use(privateMiddleware);
app.get("/", handlehome);
app.get("/login", handlelogin);
app.get("/private", privatepage);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);