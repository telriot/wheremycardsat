require("dotenv").config();
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import session from "express-session";
import { default as connectMongoDB } from "connect-mongo";
const MongoStore = connectMongoDB(session);
import passport from "./passport";
import authRouter from "./routes/auth";
import decksRouter from "./routes/decks";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();
const cors = require("cors");

app.use(
	cors({
		origin: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
		exposedHeaders: ["x-auth-token"],
	})
);

//Connect to the DB
mongoose.connect(
	process.env.MONGO_URI || `mongodb://localhost:27017/investocracy`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("DB Connected");
});
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

//Local environment
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//AWS LOAD BALANCER PROXY
app.set("trust proxy", 1);
// Sessions
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: db }),
		cookie: { maxAge: 365 * 24 * 60 * 60 * 7 },
	})
);
//Passport
app.use(passport.initialize());
app.use(passport.session());

//Create Routes

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/decks", decksRouter);
app.use("/api/users", usersRouter);

// Prepare Production Settings

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

module.exports = app;
