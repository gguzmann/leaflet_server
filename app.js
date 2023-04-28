require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const { Server } = require('socket.io')
const { positionsQuestion } = require('./positions')
app.use(cors())
const io = require('socket.io')(server, { cors: { origin: "*" } });
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hola')
})

const users = {}
let questions_actives = positionsQuestion
console.log(positionsQuestion.length)

io.on('connection', (socket) => {
    socket.on('connec', (name) => {

        console.log('user connected', socket.id)
        users[socket.id] = {
            id: socket.id,
            name: name,
            position: {
                lat: 13.408904896098697,
                lng: -77.69531250000001
            }
        }
        io.emit('conn', users)
        socket.emit('questionsPosition', questions_actives)
    })

    socket.on('newPosition', ({ coords }) => {
        users[socket.id].position = coords
        io.emit('positions', users)
    })

    socket.on('QuestionResponse', pos => {
        // console.log(pos)
        const newArray = questions_actives.filter((x) => x[0] !== pos[0] && x[1] !== pos[1])
        questions_actives = newArray
        // console.log(newArray.length)
        io.emit('questionsPosition', questions_actives)

    } )

    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log('user disconnect', socket.id)
        io.emit('disconn', users)
    })
})

server.listen(port, () => console.log('server on in port', port))

