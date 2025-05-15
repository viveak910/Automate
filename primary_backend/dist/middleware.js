"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    try {
        const payload = jsonwebtoken_1.default.verify(authHeader, process.env.JWT_SECRET);
        // @ts-ignore
        req.id = payload.id;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
