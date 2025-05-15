require('dotenv').config()

import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer =  kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
          if (!message.value?.toString()) {
            return;
          }

          const parsedValue = JSON.parse(message.value?.toString());
          const zapRunId = parsedValue.zapRunId;
          const stage = parsedValue.stage;

          const zapRunDetails = await prismaClient.zapRun.findFirst({
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
          const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

          if (!currentAction) {
            console.log("Current action not found?");
            return;
          }

          const zapRunMetadata = zapRunDetails?.metadata;

          console.dir(currentAction, { depth: null });

          if (currentAction.type.id === "email") {
            const metadata = currentAction.metadata as JsonObject;

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
          await new Promise(r => setTimeout(r, 500));

          const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1; // 1
          console.log(lastStage);
          console.log(stage);
          if (lastStage !== stage) {
            console.log("pushing back to the queue")
            await producer.send({
              topic: TOPIC_NAME,
              messages: [{
                value: JSON.stringify({
                  stage: stage + 1,
                  zapRunId
                })
              }]
            })  
          }

          console.log("processing done");
          // 
          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString() 
          }])
        },
      })

}

main()
