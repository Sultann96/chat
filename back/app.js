import express from "express"
import { Server } from "socket.io"
import path, { dirname } from "path"
import { text } from "stream/consumers"
import { fileURLToPath } from "url"

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

const app = express()
const io = new Server(3001, {
    path: '/',
    cors: '*'
})

app.use(express.static(path.join(__dirname,'../public')))

let memoryMessage = []

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname,'../public', 'index.html'))
})
app.get('/start', (req, res) => {

    res.sendFile(path.join(__dirname,'../public','start.html'))
})

io.on('connection', (socket) => {
    console.log(" user connected",socket.id)
    socket.on('chat message', (msg) => {
        const messageData = {
            text:msg,
            userId: socket.id,
        }
        
        
        io.emit('chat message', messageData)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
    })
})

app.listen(3000, () => console.log("work"))