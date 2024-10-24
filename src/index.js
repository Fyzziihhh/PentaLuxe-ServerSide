import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRouter from "./routes/user/user.routes.js";
import adminRouter from './routes/admin/admin.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import nocache from 'nocache'
dotenv.config({ path: "src/.env" });
import MongoStore from 'connect-mongo'; 
process.setMaxListeners(20);
const app = express();
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET, // Secret for signing the session ID cookie
  resave: false, // Don't save session if uninitialized
  saveUninitialized: false, // Don't create session until something stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL// MongoDB connection string
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true // Prevent JavaScript access to the cookie
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(nocache())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('something went wrong')
  console.error(err.stack);

  res.status(500).json({ message: 'Something went wrong!' });
});
app.use(express.static("public"));

// Routers
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);


const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});