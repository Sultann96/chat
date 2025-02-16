// const startPage = document.querySelector("#start-page")
// const chatPage = document.querySelector('#chat-page')

const startBtn = document.getElementById('start-chat')
const genderSelect = document.querySelector('#gender')
if (startBtn) {
    startBtn.addEventListener('click', () => {
        const gender = genderSelect.value

        window.location.href = '/chat'
    })
}

const socket = io('http://localhost:3001')

let form = document.querySelector('.input')
let chat = document.querySelector('.chat')
let inp = document.querySelector('#inp')
let btn = document.querySelector('#send')

function sendMessage() {
    let text = inp.value.trim()

    if (!text) {
        alert('пустое сообщение')
        return
    }
    socket.emit('chat message', text)

    inp.value = ''
}

function addMessage(messageData, isCurrentUser) {
    let addTextMessage = document.createElement('div')
    addTextMessage.textContent = messageData.text
    addTextMessage.classList.add('message')

    if (isCurrentUser) {
        addTextMessage.classList.add('user')
    } else {
        addTextMessage.classList.add('other-user')
    }

    chat.appendChild(addTextMessage)

    const needScroll = chat.scrollHeight > chat.clientHeight
    chat.classList.toggle('auto-scroll', needScroll)

    chat.scrollTop = chat.scrollHeight
    // if (needScroll) {
    // }
}

socket.on('chat message', (messageData) => {
    const isCurrentUser = messageData.userId === socket.id
    addMessage(messageData, isCurrentUser)
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    sendMessage()
})