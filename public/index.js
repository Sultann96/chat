const socket = io('http://localhost:3001')

const startBtn = document.getElementById('start-chat')
const genderSelect = document.querySelector('#gender')
if (startBtn) {
    startBtn.addEventListener('click', () => {
        const myGender = document.getElementById('my-gender').value
        const myAge =document.getElementById('my-age').value
        const searchGender = document.getElementById('gender').value
        const searchAge = document.getElementById('age').value

        socket.emit('register user', {gender: myGender, age:myAge})

        socket.emit('search user', {gender: searchGender, age:searchAge})

        window.location.href = '/chat'
    })
}


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
}

socket.on('chat message', (messageData) => {
    const isCurrentUser = messageData.userId === socket.id
    addMessage(messageData, isCurrentUser)
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    sendMessage()
})