import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerEstudiantes from "./routers/estudiante_routes.js";
import routerAdmin from "./routers/administrador_routes.js";
import routerComunidades from "./routers/comunidades_routes.js";
import routerComentarios from "./routers/comentarios_routes.js";
import routerMensajes from "./routers/mensajes_routes.js";
import { app, server } from "./config/socket.js";
import connection from "./database.js";

dotenv.config(); // Configurations
app.set("port", process.env.PORT || 3000);
const allowedOrigins = [process.env.URL_FRONTEND];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", routerEstudiantes);
app.use("/api", routerAdmin);
app.use("/api", routerComunidades);
app.use("/api", routerComentarios);
app.use("/api", routerMensajes);

app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

server.listen(app.get("port"), () => {
  console.log(`Server running on http://localhost:${app.get("port")}`);
  connection();
});
