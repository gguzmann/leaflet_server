require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const {Server} = require('socket.io')
app.use(cors())
const io = require('socket.io')(server, {cors: {origin: "*"}});
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hola')
})

const users = {}

io.on('connection', (socket) => {
    console.log('user connected', socket.id)
    users[socket.id] = {
        id: socket.id,
        position: {
            lat: 13.408904896098697,
            lng: -77.69531250000001
          }
    }
    io.emit('conn', users )

    socket.on('newPosition', ({coords}) => {
        users[socket.id].position = coords
        io.emit('positions', users )
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log('user disconnect', socket.id)
        io.emit('disconn', users)
    })
})

server.listen(port, () => console.log('server on in port', port))

