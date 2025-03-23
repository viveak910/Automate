import { Router } from 'express';
import type { Request, Response } from 'express';
import { SignupSchema ,ZapSchema} from '../types';
import  prisma  from '../db';
import { authMiddleware } from '../middleware';
import jwt from 'jsonwebtoken';


const router = Router();
// @ts-ignore
router.post("/signup", async (req: Request, res: Response) => {
    // Parse input data
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Signup Failed",
            errors: parsedData.error.format()
        });
    }
    const data = parsedData.data;

    // Check if user already exists
    const userExists = await prisma.user.findFirst({
        where: { email: data.email }
    });

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password, 
        }
    });

    return res.status(201).json(user);
});
// @ts-ignore
router.post("/signin",async(req:Request,res:Response)=>{
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Signin Failed",
            errors: parsedData.error.format()
        });
    }
    const data = parsedData.data;
    const user = await prisma.user.findFirst({
        where : {
            email : data.email,
            password : data.password
        }
    });
    if(!user){
        return res.status(401).json({message : "Invalid Credentials"})
    }
    const token = jwt.sign({id : user.id}, process.env.JWT_SECRET as string);
    return res.status(200).json({token});
}
)
// @ts-ignore
router.get("/user",authMiddleware,async(req:Request,res:Response)=>{
    // @ts-ignore
    const id = req.id ; 
    const user = await prisma.user.findUnique({
        where : {
            id : id
        },
        select :{
            name : true,
            email : true
        }
    });

    return res.status(200).json({user});
})
// @ts-ignore
router.post("/createzap",authMiddleware,async(req:Request,res:Response)=>{
    const parsedData = ZapSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            message : "Invalid Data",
            errors : parsedData.error.format()
        })
    }
    const data = parsedData.data ; 
    
    const zapObject  = await prisma.$transaction(async tx =>{
        const zap = await tx.zap.create({
            data:{
                // @ts-ignore
                userId : req.id,
                trigger: undefined,
                actions:{
                    create: parsedData.data.actions.map((x,index)=>{
                        return {
                            actionId: x.availableActionId,
                            sortingOrder: index,
                        };
                    })
                }
            }
        });
        
        return zap;
    });
    return res.status(201).json(zapObject);
})
// @ts-ignore
router.get("/:zapid",authMiddleware,async(req:Request,res:Response)=>{
    // @ts-ignore 
    const id = req.id ;
    const zapId = req.params.zapid;
    const zaps = await prisma.zap.findMany({
        where:{
            id : zapId,
            userId : id
        },
        include:{
            actions:{
                include:{
                    type :true,
                }
            },
            trigger:{
                include:{
                    type : true,
                }
            }
        }
    })
})
export const userRouter = router;
