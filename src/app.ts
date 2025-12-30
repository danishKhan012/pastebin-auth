import express from "express";
import cors from "cors";
import health from "./routes/health";
import pastes from "./routes/pastes";

const app = express();

       app.use(cors());
       app.use(express.json());

        app.use("/api", health);
        app.use("/api", pastes);
         app.use("/", pastes);

export default app;
