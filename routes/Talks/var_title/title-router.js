// Modules, Libraries & Frameworks

const express = require("express"),
ws = require("ws")

// Class & another imports

const { Comment } = require("../themes")

const router = express.Router()

// Express

router.all("/:title", (req, res) => {
    console.log(res.locals)
    
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

// Middleware

// GET 

// POST

module.exports = router