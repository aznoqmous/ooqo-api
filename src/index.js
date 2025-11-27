import express from "express"
import cors from "cors"
import {PrismaClient} from "@prisma/client"

const app = express()
const port = process.env.PORT
const prisma = new PrismaClient()

app.use(cors());
app.use(express.json());

const toJson = (object)=> JSON.stringify(object, (key, value) =>
    typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    )


app.get("/hello", (req,res)=>{
    res.send({foo:"bar"})
})

app.post("/run", async(req,res)=>{
    const data = req.body
    console.log(data)
    delete data.id

    const lastResult = await prisma.Run.findFirst({
        orderBy: {
            Score: "desc"
        },
        skip: 9,
        take: 1
    })

    await prisma.Run.create({
        data
    })

    // Limit runs to 10
    // if(!lastResult){
    //     await prisma.Run.create({
    //         data
    //     })
    // }
    // else if(lastResult.Score < data.Score){
    //     await prisma.Run.delete({
    //         where: {
    //             id: lastResult.id
    //         }
    //     })
    //     await prisma.Run.create({
    //         data
    //     })
    // }
    res.send(true)
})

app.get("/leaderboard", async(req,res)=>{
    const Runs = await prisma.Run.findMany({
        orderBy: {
            Score: "desc"
        },
        take: 10
    })
    res.send({Runs})
})

app.get("/count", async(req,res)=>{
    const count = await prisma.Run.count()
    res.send({count})
})

app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})