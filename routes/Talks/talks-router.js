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
  
  if (!Object.values(await titles()).includes(title)) {
    const jsonData = (await talks()),
    themes = jsonData["talks"]
    // update json file
    
    themes.push(theme)

    await writeFile(jsonPath, JSON.stringify(jsonData))

    res.cookie("name", name)
    res.sendStatus(200)
  }
  else res.sendStatus(403)
})

// WebSocket

const wssTalks = new webSocket.Server({
  port: 8080
})

wssTalks.on("connection", ws => {
  sendJSON(ws)

  ws.on("message", () => sendJSON(ws))
})

// Functions 

async function sendJSON(ws) {
  ws.send(JSON.stringify(await titles()))
}

const talks = async () => {
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
  let themes = await talks()
  
  themes = themes["talks"]

  // paste all of the titles into this object
  
  for (let i = 0; i < themes.length; i++) {
    titles[i] = themes[i].title
    titles.length++
  }
  
  return titles
}

module.exports = router