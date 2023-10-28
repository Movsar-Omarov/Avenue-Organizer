const form = document.getElementsByTagName("form")[0],
commentInput = document.getElementById("comment-input"),
ol = document.getElementsByTagName("ol")[0]
let comments = []

// update comments

const socket = new WebSocket("ws://localhost:8081/")

socket.addEventListener("message", ({data}) => {
    const talk = JSON.parse(data)

    if (JSON.stringify(talk["comments"]) === JSON.stringify(comments)) return
    
    ol.innerHTML = ""
    
    comments = talk["comments"]
    
    for (const comment of comments) {
        const li = document.createElement("li")

        li.textContent = `${comment.name}: ${comment.text}`
        ol.appendChild(li)
     }
    
})

setInterval(() => socket.send("need comments!"), 100)

// post comments

form.addEventListener("submit", async e => {
    e.preventDefault()

    fetch(window.location + "/comments", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment: commentInput.value
        })
    })
})