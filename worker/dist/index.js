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
require('dotenv').config();
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const prismaClient = new client_1.PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker-2' });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e;
                console.log({
                    partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                if (!((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString())) {
                    return;
                }
                const parsedValue = JSON.parse((_d = message.value) === null || _d === void 0 ? void 0 : _d.toString());
                const zapRunId = parsedValue.zapRunId;
                const stage = parsedValue.stage;
                const zapRunDetails = yield prismaClient.zapRun.findFirst({
                    where: {
                        id: zapRunId
                    },
                    include: {
                        zap: {
                            include: {
                                actions: {
                                    include: {
                                        type: true
                                    }
                                }
                            }
                        },
                    }
                });
                const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.find(x => x.sortingOrder === stage);
                if (!currentAction) {
                    console.log("Current action not found?");
                    return;
                }
                const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                console.dir(currentAction, { depth: null });
                if (currentAction.type.id === "email") {
                    const metadata = currentAction.metadata;
                    if (!metadata || typeof metadata.body !== "string" || typeof metadata.email !== "string") {
                        console.error("Invalid metadata for email action", metadata);
                        return;
                    }
                    //const body = parse(metadata.body, zapRunMetadata);
                    //const to = parse(metadata.email, zapRunMetadata);
                    console.log(`Sending out email `);
                }
                if (currentAction.type.id === "send-sol") {
                    //const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                    //const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                    console.log(`Sending out SOL`);
                    // comment this out becuase we dont have solana wallet
                    //  await sendSol(address, amount);
                }
                // 
                yield new Promise(r => setTimeout(r, 500));
                const lastStage = (((_e = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions) === null || _e === void 0 ? void 0 : _e.length) || 1) - 1; // 1
                console.log(lastStage);
                console.log(stage);
                if (lastStage !== stage) {
                    console.log("pushing back to the queue");
                    yield producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    zapRunId
                                })
                            }]
                    });
                }
                console.log("processing done");
                // 
                yield consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }]);
            }),
        });
    });
}
main();
