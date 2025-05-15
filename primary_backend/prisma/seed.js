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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.availableAction.create({
            data: {
                id: "webhook",
                name: "Webhook",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjWUr0rIHZc1vGIRVuGE-lNIDgNInEgStJpQ&s",
            }
        });
        yield client.availableTrigger.create({
            data: {
                id: "send-sol",
                name: "send solona",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCSO-UENmvWwWN33bvtut1TNz3M_OUj9--w&s",
            }
        });
        yield client.availableTrigger.create({
            data: {
                id: "email",
                name: "send email",
                image: "https://www.istockphoto.com/illustrations/email-logo",
            }
        });
    });
}
main();
