import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRouter from "./routes/user/user.routes.js";
import adminRouter from "./routes/admin/admin.routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import nocache from "nocache";
import MongoStore from 'connect-mongo'

dotenv.config({ path: "src/.env" });
process.setMaxListeners(20);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(nocache());
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://5zziiihhh:pentaluxe@pentaluxe-e-commerce.ra5wd.mongodb.net/?retryWrites=true&w=majority&appName=PentaLuxe-E-Commerce';
app.use(
  cors({
    origin: "https://pentaluxeshop.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "authorization"],
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.ADMIN_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure:true
    },
    store:  MongoStore.create({
     mongoUrl
    })
  })
);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("something went wrong");
  console.error(err.stack);

  res.status(500).json({ message: "Something went wrong!" });
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
