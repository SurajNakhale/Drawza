import { JWT_SECRET } from "@repo/backend-common/config";
import { LoginSchemaType, type SignupSchemaType } from "@repo/common/types"
import { prisma } from "@repo/database/client"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function generateToken(id: string){
    const token = jwt.sign({
        userId: id
    }, JWT_SECRET);
    return token;
}
export const signup = async (data: SignupSchemaType) => {
    const { name, username, password } = data;
    try{
        const exits = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(exits){
            throw new Error("user already exists")
        }

        const hashpass = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password: hashpass
            },
            select: {
                id: true,
                name: true,
                username: true
            }
        })

        const token = generateToken(newUser.id);


        return {
            token: token,
            id: newUser.id
        }
    }
    catch(err){

    }
}

export const login = async (data: LoginSchemaType) => {
    const {username, password} = data;

    const exists = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if(!exists) throw new Error("user does not exists");

    const matchpass = await bcrypt.compare(password, exists.password);
    
    if(!matchpass) throw new Error("password des not match");

    const token = generateToken(exists.id);

    return {
        token: token,
        id: exists.id
    }
}

export const userInfo = async( userId: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            username: true
        }
    })

    if(!user) throw new Error("user does not exists");

    return user;
}