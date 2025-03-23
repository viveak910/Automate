import express from 'express'
import { userRouter} from "./router/user"
import cors from 'cors'
const app = express();
app.use(express.json())
app.use(cors());
app.use("/api/v1", userRouter);

app.listen(3001 , ()=>{
    console.log("Server started at port 3001")
});
