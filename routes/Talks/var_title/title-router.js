// Modules, Libraries & Frameworks

const express = require("express"),
ws = require("ws"),
{ readFile, writeFile } = require("fs/promises")

// Class & another imports

const { Comment } = require("../themes")

const router = express.Router()

// General Variables, Contstants etc.

const jsonPath = "routes/Talks/talks.json"

let title, jsonData

// read json file

readFile(jsonPath, {
    encoding: "utf-8"
})
.then(data => jsonData = JSON.parse(data))

// Middleware

router.param("title", (req, res, next) => {
    title = req.params["title"]
    next()
})

// Express

router.all("/:title", (req, res) => {
    const theme = talk(req.params["title"])
    
    if (!theme) {
        res.sendStatus(404)
        res.end()
    }
    else res.render("theme", {
        title: theme.title,
        name: theme.creator,
        summary: theme.summary
    })
})

// GET 

// POST

router.post("/:title/comments", async (req, res) => {
    const theme = talk(req.params["title"]),
    { comment, name } = req.body,

    commentObj = new Comment(name, comment)
    
    theme.comments.push(commentObj)
    await writeFile(jsonPath, JSON.stringify(jsonData))
    res.sendStatus(200)
})

// WebSocket

const wss = new ws.Server({
    port: 8081
})

wss.on("connection", ws => {
    const message = () => {
        const talkCopy = talk(title)

        return JSON.stringify(talkCopy)
    }
    
    ws.send(message())

    ws.on("message", () => {
        ws.send(message())
    })
})

// Functions

const talk = title => jsonData["talks"].find(theme => theme.title === title)


module.exports = router