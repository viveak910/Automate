import {PrismaClient} from '@prisma/client';    
const client = new PrismaClient();
import {Kafka} from "kafkajs";
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers : ['localhost:9092']
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
        for(const row of pendingRows){
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map((r: any) => ({
                    value: r.zapRunId
                }))
            });
        }
        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((r: any) => r.id)
                }
            }
        });
            
    }
}
main();