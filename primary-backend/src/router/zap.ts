
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prisma } from "../db";

const router = Router();
// @ts-ignore
router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id: string = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }   

    const zapId = await prisma.$transaction(async tx => {
        const zap = await prisma.zap.create({
            data: {
                userId: parseInt(id),
                triggerId: "",
                actions: {
                    // @ts-ignore
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata
                    }))
                }
            }
        })

        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            }
        });

        await tx.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        })

        return zap.id;

    })
    return res.json({
        zapId
    })
})
// @ts-ignore
router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})
// @ts-ignore
router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

export const zapRouter = router;