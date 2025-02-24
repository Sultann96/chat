import express from "express"
import { Server } from "socket.io"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const io = new Server(3001, {
    path: '/',
    cors: '*'
})

app.use(express.static(path.join(__dirname, '../public')))

const users = []

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})
app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'start.html'))
})

io.on('connection', (socket) => {
    console.log(" user connected", socket.id)

    socket.on('register user', (userData) => {
        const existingUser = users.find(user => user.id === socket.id)
        if (!existingUser) {
            users.push({
                id: socket.id,
                gender: userData.gender,
                age: userData.age,
                searchGender: null,
                searchAge: null
            })

            console.log("Registered User", socket.id)
        }
    })

    socket.on('search user', (searchCriteria) => {
        const currentUser = users.find(user => user.id === socket.id)
        if (!currentUser) return
        currentUser.searchGender = searchCriteria.gender
        currentUser.searchAge = searchCriteria.age

        const foundUser = users.find(user =>
            user.id !== socket.id &&
            user.searchGender === currentUser.gender &&
            user.searchAge === currentUser.age &&
            currentUser.searchGender === user.gender &&
            currentUser.searchAge === user.age
        )

        if (foundUser) {
            socket.emit('search result', { found: true })
            io.to(foundUser.id).emit('search result', { found: true })

            users.splice(users.indexOf(currentUser))
            users.splice(users.indexOf(foundUser))

            console.log(`Matched users:${currentUser.id} and ${foundUser.id}`)
        } else {
            socket.emit('search result', { found: false })
        }
    })

    socket.on('chat message', (msg) => {
        const messageData = {
            text: msg,
            userId: socket.id
        }
        io.emit('chat message', messageData)
    })
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
        const index = users.findIndex(user => user.id === socket.id)
        if (index !== -1) {
            users.splice(index, 1)
            console.log('User removed', socket.id)

        }
    })
})

app.listen(3000, () => console.log("work"))