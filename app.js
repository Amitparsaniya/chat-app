const express= require('express')

const app = express()
const path =require("path")
const http = require('http')
const socketio = require("socket.io")
const { generateMessage, generateLocationMessage } = require('./src/utils/messages')
const {addUser,getUser,getUserInRoom,removeUser}  = require("./src/utils/users")

const server = http.createServer(app)

const io= socketio(server)
app.use(express.static(path.join(__dirname,"./public")))

// let count=0
io.on("connection",(socket)=>{
    // console.log('new websocket connection');

    // socket.emit("count",count)

    // socket.on("increment",()=>{
    //     count++
        // io.emit("count",count)
    // })


    socket.on("join",({username,room},callback)=>{
        const{error,user} = addUser({id:socket.id,room:room,username:username}) 

        if(error){
           return callback(error)
        }
        socket.join(user.room)
        socket.emit("message",generateMessage(user.username,"welcome!"))
        socket.broadcast.to(user.room).emit("message",generateMessage(`${user.username} has joined`))
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()

    })
    socket.on("sendMessage",(msg,callback)=>{
        const user = getUser(socket.id)
        console.log(msg);
        io.to(user.room).emit('message',generateMessage(user.username,msg))
        callback("delivered")
    })
    socket.on("disconnect",()=>{
       const user= removeUser(socket.id)

       if(user){
           io.to(user.room).emit("message",generateMessage(`${user.username} has left!`)) 

           io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUserInRoom(user.room)
        })
       }

    })

    socket.on("send-location",(msg)=>{
        const user = getUser(socket.id)


        io.to(user.room).emit("locationMessage" , generateLocationMessage(user.username,`https://google.com/maps?q=${msg.latitude},${msg.longitude}`))
    })



})
server.listen(7000,()=>{
    console.log('server is up on the port 7000');
})