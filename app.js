require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const authRouter = require("./routes/authRoutes");
const targetRouter = require("./routes/targetRoutes");
const recordRouter = require("./routes/recordRoutes");
const settingRouter = require("./routes/settingRoutes");
const { changeIcon } = require("./controllers/settingController");
const auth = require("./middleware/auth");
const { addTarget, editTarget } = require("./controllers/targetController");
const { findTarget, checkCurrentTarget } = require("./middleware/target");
const getDashboardData = require("./controllers/dashboardController");
const { errorHandleFunction } = require("./error/error");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(mongoSanitize());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Multer
const iconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/icon/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const newFileName = `${req.userId}${extension}`;
    cb(null, newFileName);
  },
});
const iconUpload = multer({
  storage: iconStorage,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("File format not supported."), false);
    }
  },
});
const targetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/target/");
  },
  filename: (req, file, cb) => {
    const time = Date.now();
    const extension = path.extname(file.originalname);
    const newFileName = `${req.userId}-${time}${extension}`;
    cb(null, newFileName);
  },
});
const targetUpload = multer({
  storage: targetStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

//static
app.use(express.static("./public"));

//routes
app.use("/api/v1/auth", authRouter);
app.get("/api/v1/dashboard", auth, getDashboardData);
app.post(
  "/api/v1/target/",
  auth,
  checkCurrentTarget,
  targetUpload.single("photo"),
  addTarget
);
app.patch(
  "/api/v1/target/:id",
  auth,
  findTarget,
  targetUpload.single("photo"),
  editTarget
);
app.use("/api/v1/target", auth, targetRouter);
app.use("/api/v1/record", auth, recordRouter);
app.post("/api/v1/setting/icon", auth, iconUpload.single("icon"), changeIcon);
app.use("/api/v1/setting", auth, settingRouter);

//Error
app.use(errorHandleFunction);

//DB connect and start
const port = process.env.PORT || 3001;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    console.log(`Database connection error: ${err}`);
  }
};

start();
