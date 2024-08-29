import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({ path: "src/.env" });
import userRouter from "./routes/user/user.routes.js";
import adminRouter from './routes/admin/admin.routes.js'
import cookieParser from 'cookie-parser'
const app = express();
app.use(express.urlencoded());
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))


app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)

const PORT = process.env.PORT || 3000;
connectDB()



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
