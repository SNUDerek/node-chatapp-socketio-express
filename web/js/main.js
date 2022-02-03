
const roomName = document.getElementById('room')
const userList = document.getElementById('users')
const chatHistory = document.getElementById('chat-history')
const chatForm = document.getElementById('chat-form')

const socket = io()

// on join
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
socket.emit('joinChat', { username, room })
console.log(`${username} connected to ${room}`)

// get users
socket.on('roomUsers', ({ room, users }) => {
    setRoomName(room)
    setUserList(users)
})

// on message from server
socket.on('message', message => {
    console.log(message)
    setMessage(message)
})

// submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let message = e.target.elements.message.value
    message = message.trim()
    if (!message) {
      return false;
    }
    console.log(message)
    socket.emit('newMessage', message)
    e.target.elements.message.value = ''
})

function scrollHistory() {
    chatHistory.scrollTop = chatHistory.scrollHeight
    chatHistory.focus()
    chatForm.message.focus()
}

// send message to DOM
function setMessage(message) {
    let history = chatHistory.value
    newLine = `\r\n[${message.time}] ${message.name}: ${message.text}`
    history = history + newLine
    chatHistory.value = history
    chatHistory.focus()
    // scroll to latest messages
    scrollHistory()
    
}

// add room name to DOM
function setRoomName(room) {
    roomName.innerText = room
}

// add users to DOM
function setUserList(users) {
    const userElements = `${users.map(user => `<li>${user.name}</li>`).join('')}`
    console.log(userElements)
    userList.innerHTML = userElements
}
