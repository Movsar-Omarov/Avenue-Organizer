// Modules, Libraries & Frameworks

const express = require("express"),
webSocket = require("ws"),
{ readFile, writeFile } = require("fs/promises")

// Class & another imports

const { Theme } = require("./themes")
const titleRouter = require("./var_title/title-router")

const router = express.Router()

// General Variables, Constantes etc.

const jsonPath = "routes/Talks/talks.json"

// Express

router.all("/", (req, res) => {
  res.render("talks")
})

router.use("/title", titleRouter)

// Middleware

// GET

// POST

router.post("/themes", async (req, res) => {
  const { title, name, summary } = req.body
  const theme = new Theme(title, name, summary)
  
  // check if title sent by client exists

  const titlesCopy = await titles()
  
  if (!Object.values(titlesCopy).includes(title)) {
    const jsonData = await json(),
    talks = jsonData["talks"]

    // update json file
    
    talks.push(theme)

    await writeFile(jsonPath, JSON.stringify(jsonData))

    res.cookie("name", name)
    res.sendStatus(200)
  }
  else res.sendStatus(403)
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

async function sendJSON(ws) {
const titlesCopy = await titles()

  ws.send(JSON.stringify(titlesCopy))
}

const json = async () => {
  const data = await readFile(jsonPath, {
    encoding: "utf-8"
  })
  
  return JSON.parse(data)
}

const titles = async () => {
  // create object like dom
  
  const titles = {
    length: 0
  }
  let talks = await json()
  
  talks = talks["talks"]

  // paste all of the titles into this object
  
  for (let i = 0; i < talks.length; i++) {
    titles[i] = talks[i].title
    titles.length++
  }
  
  return titles
}

module.exports = router