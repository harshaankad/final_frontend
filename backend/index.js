import http from "http";
import 'dotenv/config';
import app from "./app.js";

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
 });

