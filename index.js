const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const ws = require("ws")

const port = process.env.PORT || 3000

const wss = new ws.Server({ noServer: true })

wss.on('connection', socket => {
    socket.on('message', message => {
        wss.clients.forEach(client => {
            client.send(message.toString())
        })
    })
})

app.use(express.static(__dirname+"/public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/public/index.html")
})

server.listen(port, () => console.log("Listen on "+port))

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request)
    })
})