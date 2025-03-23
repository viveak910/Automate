import {z} from 'zod';
export const SignupSchema = z.object({
    name : z.string().min(5),
    password : z.string().min(5),
    email : z.string().email()
    
})
export const SigninSchema = z.object({
    username : z.string(),
    password : z.string()
})
export const ZapSchema = z.object({
    availableTriggerId : z.string(),
    triggerMetadata:z.any().optional(),
    actions :z.array(z.object({
        availableActionId : z.string(),
        actionMetadata : z.any().optional()
    }))

})