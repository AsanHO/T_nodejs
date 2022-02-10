import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();

const logger = morgan("dev")

const handlehome = (req, res) => {
    console.log("home")
    return res.send("home")
}

const handlelogin = (req, res) => {
    console.log("login")
    return res.send("login")
}

app.use(logger)
app.get("/", handlehome);
app.get("/login", handlelogin);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);