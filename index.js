const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const path=require('path');
const multer = require('multer');


const app= express();
const server=http.createServer(app);


const io= socketIo(server);

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


app.get("/",(req,res,next)=>{
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile("index.html",options);
})


app.use(express.urlencoded({extended: false}));

const upload=multer({storage: storage});

app.post("/uploads",upload.single("profileImage"),(req,res,next)=>{
    console.log(req.body);
    console.log(req.file);
     res.redirect("/");
})

const port=3001;
server.listen(process.env.PORT,()=>{
    console.log(`server running on http://127.0.0.1:${port}`);
})

