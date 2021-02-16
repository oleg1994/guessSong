const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 4000
const app = express();
const server = http.createServer(app);
const { addUser, getUser, removeUser, getUsersInRoom, increaseScore } = require('./users');

const io = socketio(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', socket => {
  console.log('new connection', socket.id)


  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room)
    //send the existing data of the entered room
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

    //sets the first player in array as leader of the lobby
    let leader = getUsersInRoom(user.room)[0]
    io.to(leader.id).emit("private", { leader: true });

  })

  socket.on('requestStart', (ss, callback) => {
    const { room } = getUser(socket.id)
    io.to(room).emit('startGame', { start: true })
  })
  socket.on('activeSongs', (data, callback) => {
    const { room } = getUser(socket.id)
    io.to(room).emit('roundPool', data)

  })
  socket.on('rightAnswer', (data, callback) => {
    const { id, name, room } = increaseScore(socket.id)
    io.to(socket.id).emit("private", { answer: 'right' });
    io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room), name })
    // io.to(room).emit('announceWinner', { name, })
    // io.to(room).emit('answers', { room: room, users: getUsersInRoom(room) })
  })



  socket.on('disconnect', (reason) => {
    console.log(socket.id, 'user left')
    const removedUser = removeUser(socket.id)
    //update with left players
    if (removedUser) {
      //update with left players inside the room
      io.to(removedUser.room).emit('roomData', { room: removedUser.room, users: getUsersInRoom(removedUser.room) })

      //sets the first player in array as leader of the lobby
      let leader = getUsersInRoom(removedUser.room)[0]
      if (leader) {
        io.to(leader.id).emit("private", { leader: true });
      }
    }
  })


})
// server.listen(PORT,'192.168.1.139' || 'localhost',(err)=> {
//   if (err) {
//     throw Error(err)
//   }
//   console.log('server port', PORT)
//   console.log('Application worker ' + process.pid + ' started...');
// }
// );


server.listen(PORT, (err) => {
  if (err) {
    throw Error(err)
  }
  console.log('server port', PORT)
})