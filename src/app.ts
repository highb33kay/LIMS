import express from "express";
import { readdirSync } from "fs";
import { sayHelloController } from "./controllers/index";
import "dotenv/config";
import { errorHandler } from "./middlewares/index";
import morgan from "morgan";
import https from "https";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { Server, createServer } from "http";

const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");

const app = express();

app.use(morgan("dev"));

//  Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

function keepAlive(url) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}
// middleware setup

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(cookieParser());

//serve all routes dynamically using readdirsync
readdirSync("./src/routes").map((path) => {
  app.use("/api/v1/", require(`./routes/${path}`));
});

app.get("/", sayHelloController);
app.use(errorHandler);
const port = process.env.PORT || 3000;

const httpServer = createServer(app);

const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: false,
};

app.use(cors(corsOptions));

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
