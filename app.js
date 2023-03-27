const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.static('public/guestbooksite/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/guestbook', (req, res) => {
    res.sendFile(__dirname + '/public/guestbook.html')
})

app.get('/newmessage', (req, res) => {
    res.sendFile(__dirname + '/public/newmessage.html')
})

app.get('/ajaxmessage', (req, res) => {
    res.sendFile(__dirname + '/public/ajaxmessage.html')
})

app.get('*', (req, res) => {
    res.send('Cant find the requested page', 404)
})

app.listen(5000)