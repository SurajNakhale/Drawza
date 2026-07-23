import { loginSchema, signupSchema } from "@repo/common/types";
import { NextFunction, Request, Response } from "express";
import { httpStatus } from "../utils/http";
import * as authService from "../services/auth.service"

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const parsedMsg = signupSchema.safeParse(req.body);
    if(!parsedMsg.success) return res.status(httpStatus.BAD_REQUEST).json("validation error");

    try{
         const result = await authService.signup(parsedMsg.data);

         res.status(httpStatus.CREATED).json(result)
    }
    catch(err){
        next(err);
    }

}
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const parsedMsg = loginSchema.safeParse(req.body);
    if(!parsedMsg.success) return res.status(httpStatus.BAD_REQUEST).json("validation error");

    try{
         const result = await authService.login(parsedMsg.data);

         res.status(httpStatus.OK).json(result)
    }
    catch(err){
        next(err);
    }

}
export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    try{
         const result = await authService.userInfo(userId);

         res.status(httpStatus.OK).json(result)
    }
    catch(err){
        next(err);
    }

}

