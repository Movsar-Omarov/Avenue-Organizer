// Modules, Libraries & Frameworks

const express = require("express"),
webSocket = require("ws"),
{ readFile, writeFile } = require("fs/promises")

// Class & another imports

const { Theme } = require("./themes")
const titleRouter = require("./var_title/title-router")

const router = express.Router()

const jsonPath = "./talks.json"

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

  if (!Object.values(titles()).includes(title)) {
    // read json file

    const themes = talks()

    themes[name] = theme

    // update json file

    await writeFile(jsonPath, JSON.stringify(themes))
  }
  else res.sendStatus(403)
  
  res.cookie("name", theme.creator)
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

// Functions 

function sendJSON(ws) {
  console.log(titles())
  ws.send(JSON.stringify(titles()))
}

const talks = async () => {
  const data = await readFile(jsonPath, {
    encoding: "utf-8"
  })
  console.log(data)
  return JSON.parse(data)["talks"]
}

const titles = () => {
  // create object like dom
  
  const titles = {
    length: 0
  }
  
  for (let i = 0; i < talks().length; i++) {
    titles[i] = talks()[i].title
    titles.length++
  }

  return titles
}

module.exports = router