const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    
    const existingUser = users.find((user) => user.room === room && user.name === name)
    if (existingUser) return { error: 'username is taken' }

    const user = { id, name, room, points:0 }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const userExist = users.find((user) => user.id === id)
    if (userExist) {
        return userExist
    } else {
        return {error:'no such user'}
    }
}
const increaseScore = (id) => {
    // const userExist = users.find((user) => user.id === id)
    const userExist = users.find(user => (user.id === id ? { ...users, points: user.points++ } : null));
    // console.log(users,37)
    if (userExist) {
        return userExist
    } else {
        return {error:'no such user'}
    }
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom,increaseScore }