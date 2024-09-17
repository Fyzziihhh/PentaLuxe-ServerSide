import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({ path: "src/.env" });
import userRouter from "./routes/user/user.routes.js";
import adminRouter from './routes/admin/admin.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import nocache from 'nocache'
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(nocache())

app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60,  // 1 hour,
    httpOnly:true,
  }
  
}));

app.use(express.static("public"));

// Routers
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});