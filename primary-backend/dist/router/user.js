"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// @ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Parse input data
    const parsedData = types_1.SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Signup Failed",
            errors: parsedData.error.format()
        });
    }
    const data = parsedData.data;
    // Check if user already exists
    const userExists = yield db_1.prisma.user.findFirst({
        where: { email: data.email }
    });
    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }
    // Create new user
    const user = yield db_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
        }
    });
    return res.status(201).json({ user });
}));
// @ts-ignore
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Signin Failed",
            errors: parsedData.error.format()
        });
    }
    const data = parsedData.data;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            email: data.email,
            password: data.password
        }
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.status(200).json({ token });
}));
// @ts-ignore
router.get("/user", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const user = yield db_1.prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            name: true,
            email: true
        }
    });
    return res.status(200).json({ user });
}));
// @ts-ignore
router.post("/createzap", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.ZapSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid Data",
            errors: parsedData.error.format()
        });
    }
    const data = parsedData.data;
    const zapObject = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zap = yield tx.zap.create({
            data: {
                // @ts-ignore
                userId: req.id,
                trigger: undefined,
                actions: {
                    create: parsedData.data.actions.map((x, index) => {
                        return {
                            actionId: x.availableActionId,
                            sortingOrder: index,
                        };
                    })
                }
            }
        });
        return zap;
    }));
    return res.status(201).json(zapObject);
}));
// @ts-ignore
router.get("/:zapid", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore 
    const id = req.id;
    const zapId = req.params.zapid;
    const zaps = yield db_1.prisma.zap.findMany({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true,
                }
            },
            trigger: {
                include: {
                    type: true,
                }
            }
        }
    });
}));
exports.userRouter = router;
