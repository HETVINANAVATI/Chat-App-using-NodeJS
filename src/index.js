const path= require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter= require('bad-words')

const app = express();
const server=http.createServer(app);
const io = socketio(server);
const port = process.env.PORT||3000;
const publicDirectoryPath=path.join(__dirname,"../public");
app.use(express.static(publicDirectoryPath));
/* let count=0;
io.on('connection', (socket) => {
    socket.emit('countUpdated',count)
    console.log("New web socket connected")
    socket.on('increament',()=>{
        count++;
      //  socket.emit('countUpdated',count);
      io.emit('countUpdated',count);
    })
}) */
let message="Welcome";
io.on('connection',(socket)=>{
    socket.emit('message',message)
    socket.broadcast.emit('message',"A new user has joined")
    socket.on('messageSent',(msg,callback)=>{
        const filter=new Filter();
        if(filter.isProfane(msg))
        {
            io.emit('message',"message has profanity cant be viewed")
            callback("Message was  not sent");
        }
        else{
            io.emit('message',msg)
        callback("Message was sent");
        }
       
    })
    socket.on('locationSent',(position,callback)=>{
        socket.broadcast.emit('message',`https://google.com/maps?q=${position.latitude},${position.longitude}`)
        callback("Location was sent");
    })
    socket.on('disconnect',(socket)=>{
       io.emit("message","A user has left")
    })
})
server.listen(port,()=>{
    console.log(port);
});

