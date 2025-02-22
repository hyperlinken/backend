const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const path=require('path');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');


const app= express();
const server=http.createServer(app);


// const io= socketIo(server);

// app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'https://hyperlinken.github.io', // Allow your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
}));

const io = new Server(server, {
    transports: ["polling"],
    cors: {
        origin: 'https://hyperlinken.github.io', // Allow WebSocket connections from this origin
        methods: ['GET', 'POST'],
    },
});

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,"./uploads");
    },
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
})
io.on('connection',(socket)=>{
    console.log('new connection has been established\n');
    socket.on('user-msg',(message)=>{
        io.emit('msg',message);
    })

})
// const server=http.createServer(app);


app.get("/", async (req,res)=>{
    // res.send("no");
    // axios.get('https://hyperlinken.github.io/frontend/')
    // .then((response) => {
    //     if(response.status === 200) {
    //     const html = response.data;
    //     res.send(html);
    // }
    // }, (error) => console.log(err) );
})

app.get("/hi" , (req,res)=>{
    res.send("hi");
})

const upload=multer({storage: storage});

app.post("/uploads",upload.single("profileImage"),(req,res,next)=>{
    console.log(req.body);
    console.log(req.file);
     res.redirect("/");
})

const port=process.env.PORT || 3000;
server.listen(port,()=>{
    console.log(`server running on http://127.0.0.1:${port}`);
})

