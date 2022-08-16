const express = require('express');
const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server);

// TOO KEEP TRACK OF USERS ID'S
const users = [];

const port = 3001;

app.get('/', (req,res) => {
    res.send("Hello World");
})

const addUser = (userName, roomId) => {
    users.push({
        userName: userName,
        roomId: roomId
    })
}

const getRoomUsers = (roomId) => {
    return users.filter(user => user.roomId == roomId);
}

const userLeave = (userName) => {
    users.filter(user => user.userName != userName)
}

io.on("connection", socket => {
    console.log("Someone Connected") ;
    socket.on("join-room", (roomId, userName) => {
        console.log("USER JOIN ROOM");
        console.log(roomId)
        console.log(userName)
        socket.join(roomId);
        addUser();
        socket.to(roomId).emit('user-connected', userName);
        
        io.to(roomId).emit("all-users", getRoomUsers(roomId));

        socket.on("disconnect", () => {
            console.log("Disconnected");
            socket.leave(roomId);
            userLeave(userName)
            io.to(roomId).emit("all-users", getRoomUsers(roomId));
        })
    })
})

server.listen(port, () => {
    console.log('Zoom Clone API listening on localhost:3001')
})