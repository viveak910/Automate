import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
async function main(){
    console.log("🌱 Running seed...");
    await client.availableTrigger.create({
        data:{
            id : "webhook",
            name: "Webhook",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjWUr0rIHZc1vGIRVuGE-lNIDgNInEgStJpQ&s",

        }
    })

    await client.availableAction.create({
        data:{
            id : "send-sol",
            name: "send solona",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwCSO-UENmvWwWN33bvtut1TNz3M_OUj9--w&s",

        }
    })
    await client.availableAction.create({
        data:{
            id : "email",
            name: "send email",
            image: "https://www.istockphoto.com/illustrations/email-logo",

        }
    })
    console.log("🌱 seed completed");
}
main();