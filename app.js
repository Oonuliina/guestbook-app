// otetaan express käyttöön
const express = require('express')
const app = express()

// otetaan tiedostojen muokkaus ja luku käyttöön
const fs = require('fs')

// otetaan bodyparser käyttöön
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// otetaan käyttöön staattinen sisältö public-kansiosta
app.use(express.static('public'))

// otetaan EJS käyttöön
app.set('view engine', 'ejs')

// pakotetaan sivupohja tuottamaan kaunista HTML:ää
app.locals.pretty = true;

// renderöidään etusivu
app.get('/', (req, res) => {
    res.render('pages/index')
})

// renderöidään guestbook-sivu ja siihen json-muotoista dataa
app.get('/guestbook', (req, res) => {
    const datas = require('./json-data.json')
    res.render('pages/guestbook', {messages: datas}) 
})

// renderöidään newmessage-sivu
app.get('/newmessage', (req, res) => {
    res.render('pages/newmessage')
})

// lisätään syötetty data JSON tiedostoon
app.post('/newmessage', (req, res) => {
    // otetaan JSON-tiedosto käyttöön
    const data = require('./json-data.json')
    // bodyparser in action, otetaan sen avulla tiedot html formista
    const formData = {
        username: req.body.uname,
        country: req.body.country,
        message: req.body.message,
    }
    // lisätään olio
    data.push(formData)
    // muutetaan olio JSON muotoon ja tehdään siihen kaunis asettelu
    const jsonStr = JSON.stringify(data, "", 1)
    // kirjoitetaan JSON tiedosto levylle ja tarkistetaan errorien varalta
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
    // luodaan ajaxmessage sivulle taulukko, johon tulee sinne kirjoitetut tiedot näkyviin
    let results = '<table>'+
        '<tr>'+
        '<th>Username</th>'+
        '<th>Country</th>'+
        '<th>Message</th>'+
        '</tr>';

// lähetetään ajaxmessage-sivulta saatu syöte
app.post('/ajaxmessage', (req, res) => {
    // tallennetaan lomakkeen tiedot muuttujiin
    const username = req.body.uname
    const country = req.body.country
    const message = req.body.message
    
    // lisätään taulukkoon uusi rivi, jossa lukee syötetyt tiedot
    results+='<tr>'+
    '<td>'+username+'</td>'+
    '<td>'+country+'</td>'+
    '<td>'+message+'</td>'+
    '</tr>'
    // välitetään palvelimen antama "tulos" takaisin selaimelle
    res.send(results)  
})

// vihreilmoitus, jos jokin menee pieleen reittejä haettaessa
app.get('*', (req, res) => {
    res.send('Cant find the requested page', 404)
})
// kuunnellaan porttia 5000
app.listen(5000)