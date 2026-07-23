import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config"
import { roomSchema } from "@repo/common/types"
import { prisma } from "@repo/database/client";
import authRoute from "./routes/auth.routes";

const app = express();

app.use(express.json())


app.use("/auth", authRoute);
app.use("/room", );


//create room endpoint
app.post("/create-room", authMiddleware, async (req, res) => {
    //which user created the room 
    const userId = (req as any).userId;
    
    if (!userId){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    
    const parsed = roomSchema.safeParse(req.body);
    
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid input"
        })
    }
    
    const { slug } = parsed.data;
    
    try{
        const existing = await prisma.room.findUnique({
            where: { 
                slug 
            }
        })

        if (existing) {
            return res.status(400).json({
                message: "Room already exists"
            })
        }

        const room = await prisma.room.create({
            data: {
                slug,
                adminId: userId
            }
        })
    
        return res.json({
            message: "room created successfully",
            roomId: room.id
        })

    }
    catch(err){
        return res.status(500).json({
            message: "Ineternal Server error"
        })
    }
})




app.listen(3001, () => {
    console.log("HTTPS Server running on port 3001")
})