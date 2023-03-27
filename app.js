const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public/guestbooksite/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/guestbook', (req, res) => {
    res.sendFile(__dirname + '/public/guestbook.html')
})
 
/* app.get('/guestbook', (req, res) => {
    var data = require('./json-data.json')
    
    var results = '<table border="1">'+
                    '<tr>'+
                    '<th>Username</th>'+
                    '<th>Country</th>'+
                    '<th>Message</th>'+
                    '</tr>'

    for (var i=0; i < data.length; i++){
        results +=
        '<tr>'+
        '<td>'+data[i].username+'</td>'+
        '<td>'+data[i].country+'</td>'+
        '<td>'+data[i].message+'</td>'+
        '</tr>'
      }

      res.send(results)
}) */

app.get('/newmessage', (req, res) => {
    res.sendFile(__dirname + '/public/newmessage.html')
})

app.post('/newmessage', (req, res) => {
    var data = require('./json-data.json')

    var formData = {
        username: req.body.uname,
        country: req.body.country,
        message: req.body.message,
    }

    data.push(formData)

    var jsonStr = JSON.stringify(data, "", 1)

    fs.writeFile('json-data.json', jsonStr, (err) => {
        if (err) throw err
    })

    res.redirect('/guestbook')
})


app.get('/ajaxmessage', (req, res) => {
    res.sendFile(__dirname + '/public/ajaxmessage.html')
})

app.get('*', (req, res) => {
    res.send('Cant find the requested page', 404)
})

app.listen(5000)