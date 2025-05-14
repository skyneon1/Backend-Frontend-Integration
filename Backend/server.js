import express from "express"
import cors from 'cors'
const app=express();

app.use(cors());
app.use(express.json());

let jokes=[
    { id:1, j1:"tupe", likes:0 },
    { id:2, j1:"testing", likes:0 },
];

app.get("/",(req,res)=>{
    res.send("Working...");
})

app.get("/api/jokes",(req,res)=>{
    res.status(200).json(jokes);
})

app.post("/api/jokes", (req, res) => {
    const { j1 } = req.body;
    if (!j1 || typeof j1 !== 'string' || !j1.trim()) {
        return res.status(400).json({ message: "Joke text is required." });
    }
    const newJoke = { id: Date.now(), j1: j1.trim(), likes: 0 };
    jokes.push(newJoke);
    res.status(201).json(newJoke);
});

app.post("/api/jokes/:id/like", (req, res) => {
    const id = parseInt(req.params.id);
    const joke = jokes.find(j => j.id === id);
    if (!joke) {
        return res.status(404).json({ message: "Joke not found." });
    }
    joke.likes += 1;
    res.status(200).json({ likes: joke.likes });
});

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Port is running on server ${port}`)
})