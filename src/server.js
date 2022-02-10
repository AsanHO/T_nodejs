import express from "express";

const PORT = 4000;

const app = express();

const handlehome = () => console.log("somebody trying access to home");

app.get("/", handlehome);

const handleListening = () => console.log(`✅ Server Listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);