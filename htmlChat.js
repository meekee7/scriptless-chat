const express = require('express')
const fs = require('fs')

const app = express()

const port = 3000
const maxMessages = 8

const messageLog = []

function ReplaceMW(filename, source, replacement, res, next) {
    fs.readFile(__dirname + '/' + filename, (err, data) => {
        if (err)
            return next()

        var htmltext = data.toString()
        var finaltext = htmltext.replace(source, replacement)

        res.setHeader('content-type', 'text/html')
        res.send(finaltext)
    })
}

app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/index.html', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/input.html', (req, res) => res.sendFile(__dirname + '/input.html'))
app.get('/messages.html', (req, res, next) => {
    var messagetext = messageLog
        .map(x => `<b>${x.user}</b> ${x.message}`)
        .join('<br>')
    return ReplaceMW('messages.html', '<!--FillHere-->', messagetext, res, next)
})

app.post('/message', (req, res, next) => {
    if (req.body != null) {
        messageLog.push(req.body)
        if (messageLog.length > maxMessages)
            messageLog.splice(0, messageLog.length - maxMessages)
    }
    return ReplaceMW('input.html', 'value=""', `value="${req.body.user}"`, res, next)
})

app.listen(port, () => {
    console.log(`HtmlChatApp listening on port ${port}`)
})
