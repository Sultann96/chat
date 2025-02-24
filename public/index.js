const socket = io('http://localhost:3001')

const startBtn = document.getElementById('start-chat')
const loading = document.getElementById('loading')

const formElements = [
    document.getElementById('my-gender'),
    document.getElementById('my-age'),
    document.getElementById('gender'),
    document.getElementById('age'),
    startBtn
]

if (startBtn) {
    let isSearching = false
    let searchInterval = null

    const cleanupSearch = () => {
        clearInterval(searchInterval)
        loading.classList.remove('visible')
        loading.classList.add('hidden')
        formElements.forEach(element => element.disabled = false)
        isSearching = false
        socket.off('search result', handleSearchResult)
    }

    const handleSearchResult = (result) => {
        if (result.found) {
            cleanupSearch()
            window.location.href = '/chat'
        }
    }

    startBtn.addEventListener('click', () => {
        if (isSearching) return

        loading.classList.remove('hidden')
        loading.classList.add('visible')
        
        isSearching = true
        formElements.forEach(element => element.disabled = true)

        const userData = {

            myGender: document.getElementById('my-gender').value,
            myAge: document.getElementById('my-age').value,
            searchGender: document.getElementById('gender').value,
            searchAge: document.getElementById('age').value
        }


        socket.emit('register user', { gender: userData.myGender, age: userData.myAge })

        const searchUser = () => {
            socket.emit('search user', { 
                gender: userData.searchGender, 
                age: userData.searchAge 
            })
        }

        searchInterval= setInterval(searchUser,2000)
        searchUser()



        socket.on('search result', handleSearchResult)

        socket.on('disconnect', cleanupSearch)
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