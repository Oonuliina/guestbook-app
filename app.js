const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

// otetaan käyttöön staattinen sisältö public-kansiosta
app.use(express.static('public'))

app.locals.pretty = true;
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

// renderöidään etusivu
app.get('/', (req, res) => {
    res.render('pages/index')
})

// renderöidään guestbook-sivu ja siihen json-muotoista dataa
app.get('/guestbook', (req, res) => {
var datas = require('./json-data.json')
    res.render('pages/guestbook', {messages: datas}) 
})

// renderöidään newmessage-sivu
app.get('/newmessage', (req, res) => {
    res.render('pages/newmessage')
})

// lisätään syötetty data json tiedostoon
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
    // uudelleenohjataan guestbook-sivulle viestin syötteen jälkeen
    res.redirect('/guestbook')
})

// renderöidään ajaxmessage-sivu
app.get('/ajaxmessage', (req, res) => {
    res.render('pages/ajaxmessage')
})

// lähetetään ajaxmessage-sivulta saatu syöte
app.post('/ajaxmessage', (req, res) => {
    var username = req.body.uname
    var country = req.body.country
    var message = req.body.message

    var results = '<table>'+
    '<tr>'+
    '<th>Username</th>'+
    '<th>Country</th>'+
    '<th>Message</th>'+
    '</tr>'+
    '<tr>'+
    '<td>'+username+'</td>'+
    '<td>'+country+'</td>'+
    '<td>'+message+'</td>'+
    '</tr>'

    res.send(results)  
})

// vihreilmoitus, jos jokin menee pieleen
app.get('*', (req, res) => {
    res.send('Cant find the requested page', 404)
})
// kuunnellaan porttia 5000
app.listen(5000)