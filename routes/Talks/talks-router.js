// Modules, Libraries & Frameworks

const express = require("express"),
webSocket = require("ws")

// Class & another imports

const { Theme, Comment } = require("./themes")

const router = express.Router()
const talks = []
let copy

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

router.get("/:title", (req, res) => {
  const { title } = req.params
  let theme = talks.find(talk => {
    return talk.title === title
  })
  
  if (!theme) res.status(404).send("404 Page Not Found") 
  else {
    copy = title

    res.render("theme", {
      "title": theme.title,
      "name": theme.creator,
      "summary": theme.summary
    })
  }
})

// POST

router.post("/themes", (req, res) => {
  const { title, name, summary } = req.body
  const theme = new Theme(title, name, summary)
  
  // check if title sent by client exists

  if (!Object.values(titles()).includes(title)) talks.push(theme)
  else res.sendStatus(403)
  
  res.cookie("name", theme.creator)
  res.sendStatus(200)
})

router.post("/:title", (req, res) => {
  if (!req.cookies["name"]) res.status(403).send("<h1>Forbidden!</h1>")

  const { title } = req.params,
  theme = talks.find(talk => talk.title === title)
  
  const comment = new Comment(req.cookies["name"], req.body.comment)

  theme.addComment(comment)

  res.sendStatus(200)
})

// WebSocket

const wssTalks = new webSocket.Server({
  port: 8080
})

wssTalks.on("connection", ws => {
  sendJSON(ws)

  ws.on("message", () => sendJSON(ws))
})

const wssTitle = new webSocket.Server({
  port: 8081
})

wssTitle.on("connection", ws => {
  console.log(talks)
  const comments = talks.find(theme => theme.title === copy),
  object = {
    length: 0
  }
  console.log(comments)
  for (let i = 0; i < comments.length; i++) {
    object[i] = comments[i]
    object.length++
  }

  ws.send(JSON.stringify(object))

  ws.on("message", () => ws.send(JSON.stringify(object)))
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