const path= require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter= require('bad-words')
const {generateMessage,generateLocationMessage}=require("./utils/messages")
const {addUser,removeUser,getUser,getUserInRoom}=require("./utils/users")
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
    socket.on('join',(options,callback)=>{
      const {error,user} =  addUser({id:socket.id, ...options})
      if(error)
      {
          return callback(error)
      }
        socket.join(user.room)
        socket.emit('message',generateMessage("Admin",message))
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin",` ${user.username} has joined `))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })
    socket.on('messageSent',(msg,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter();
        if(filter.isProfane(msg))
        {
            io.to(user.room).emit('message',generateMessage(user.username , "Message has profanity cant be viewed"))
            callback("Message was  not sent");
        }
        else{
            io.to(user.room).emit('message',generateMessage(user.username,msg))
        callback("Message was sent");
        }
       
    })
    socket.on('locationSent',(position,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback("Location was sent");
    })
    socket.on('disconnect',()=>{
       const user = removeUser(socket.id)
      if(user)
       {
        io.to(user.room).emit("message",generateMessage("Admin",`${user.username} has left`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)

        })
       }
    })
})
server.listen(port,()=>{
    console.log(port);
});

