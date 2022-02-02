const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// static serving page
app.use(express.static(path.join(__dirname, 'web')))

// client connection
io.on('connection', socket => {
    console.log("new websocket connection")
    /*
    socket.emit() -> to this client
    socket.broadcast.emit() -> to all *other* clients
    io.emit() -> to everyone
    */
    socket.emit('message', 'welcome to crapchat, i love you')
    socket.broadcast.emit('message', 'a new user has joined')

    // on disconnect
    socket.on('disconnect', () => {
        io.emit('message', 'a user has left the chat')
    })

    // listen from newMessage
    socket.on('newMessage', (message) => {
        console.log(message)
        io.emit('message', message)
    })
})

const serverPort = process.env.SERVER_PORT || 5000

server.listen(serverPort, () => console.log(`server running on port ${serverPort}`))