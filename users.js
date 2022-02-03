const users = []

function userJoined(id, username, room) {
    const user = { id, name: username, room }
    users.push(user)
    console.log("userJoined:")
    console.log(users)
    return user
}

function userLeft(id) {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
        const user = users.splice(userIndex, 1)[0]
        console.log("userLeft:")
        console.log(users)
        return user
    }
}

function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

function getRoomUsers(room) {
    console.log(getRoomUsers)
    console.log(users.filter(user => user.room === room))
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoined,
    getCurrentUser,
    userLeft,
    getRoomUsers
}