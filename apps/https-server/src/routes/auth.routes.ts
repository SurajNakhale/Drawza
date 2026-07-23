import { Router } from "express";
import { authMiddleware } from "../middleware";
import { login, signup, userInfo } from "../controllers/auth.controller";

const authRoute: Router = Router();


authRoute.post("/signup", signup);
authRoute.post("/login", login)
authRoute.get("/userInfo", authMiddleware,  userInfo);


export default authRoute;