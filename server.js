const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./message')
const { userJoined, getCurrentUser, userLeft, getRoomUsers } = require('./users')

const adminName = 'crapbot'


// static serving page
app.use(express.static(path.join(__dirname, 'web')))

// client connection
io.on('connection', socket => {

    console.log(`${socket.id} connected`)

    // on joining the room
    socket.on('joinChat', ({ username, room }) => {
        const user = userJoined(socket.id, username, room)
        console.log(`${user.name} joined ${user.room}`)
        socket.join(user.room)
        socket.emit('message', formatMessage(adminName, 'welcome to crapchat, i love you'))
        socket.broadcast.to(user.room).emit('message', formatMessage(adminName, `user ${user.name} has joined the chat`))
        // room's userlist
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // listen for newMessage
    socket.on('newMessage', (message) => {
        const user = getCurrentUser(socket.id)
        console.log(`${user.name}: ${message}`)
        io.to(user.room).emit('message', formatMessage(user.name, message))
    })

    // on disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
        const user = userLeft(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(adminName, `user ${user.name} has left the chat`))
        }
        try {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
    } catch {
        console.log('cannot broadcast user to room')
    }
        
    })
})

const serverPort = process.env.SERVER_PORT || 5000

server.listen(serverPort, () => console.log(`server running on port ${serverPort}`))