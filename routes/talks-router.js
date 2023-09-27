// Modules, Libraries & Frameworks

const express = require("express"),
webSocket = require("ws")

// Class & another imports

const { Theme, Comment } = require("./themes")

const router = express.Router()
const talks = []

// Express

router.all("/", (req, res) => {
  res.render("talks", {
    talks: talks
  })
})

// GET

router.get("/titles", (req, res) => {
  res.json(JSON.stringify(titles()))
})

router.get("/:theme", (req, res) => {
  res.render("theme")
})

// POST

router.post("/themes", (req, res) => {
  const { title, name, summary } = req.body
  const theme = new Theme(title, name, summary)
  
  talks.push(theme)
  
  res.sendStatus(200)
})

// WebSocket

const wss = new webSocket.Server({
  port: 8080
})

wss.on("connection", ws => {
  sendJSON(ws)

  ws.on("message", () => sendJSON(ws))
})

// Functions 

function sendJSON(ws) {
  ws.send(JSON.stringify(titles()))
}

const titles = () => {
  const titles = {
    length: 0
  }

  for (let i = 0; i < talks.length; i++) {
    titles[i] = talks[i].title
    titles.length++
  }

  return titles
}


module.exports = router