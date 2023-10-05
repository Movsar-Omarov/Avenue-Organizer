const form = document.getElementsByTagName("form")[0],
commentInput = document.getElementById("comment-input"),
ol = document.getElementsByTagName("ol")[0]

// update comments

const socket = new WebSocket("ws://localhost:8081/")

socket.addEventListener("message", ({ data }) => {
    const comments = JSON.parse(data)
    console.log(comments)
    for (let i = 0; i < comments.length; i++) {
        const li = document.createElement("li"),
        comment = comments[i]

        li.textContent = `${comment.name}: ${comment.text}`
        ol.appendChild(li)
    }
})

// post comments

form.addEventListener("submit", async e => {
    e.preventDefault()

    fetch(window.location, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment: commentInput.value
        })
    })

    socket.send("need comments!")
})