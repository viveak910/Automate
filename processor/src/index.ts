import {PrismaClient} from '@prisma/client';    
const client = new PrismaClient();
import {Kafka} from "kafkajs";
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers : ['kafka:9092']
});
const TOPIC_NAME = 'zap-events';
async function main() {
    const producer = kafka.producer();
    await producer.connect();
    while(1){
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10
        });
        console.log("Pending rows", pendingRows);
        for(const row of pendingRows){
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map((r: any) => ({
                    value: JSON.stringify({zapRunId : r.zapRunId,stage:0} ),
                }))
            });
            console.log("Sending message", row.zapRunId);
        }
        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((r: any) => r.id)
                }
            }
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));

            
    }
}
main();