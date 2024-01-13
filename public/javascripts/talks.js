// update ul section

const ul = document.querySelector("ul")
let titles

const socket = new WebSocket("ws://localhost:8080/")

socket.addEventListener("message", ({data}) => {
    if (JSON.stringify(titles) !== data) formatTitles(data)
})

setInterval(() => {
    socket.send('needs titles')
}, 100)

// create talk

const form = document.querySelector("form"),
titleInput = document.querySelector("#title-input"),
nameInput = document.querySelector("#name-input"),
summaryInput = document.querySelector("#summary-input")

form.addEventListener("submit", async e => {
    e.preventDefault()

    if (!titleInput.value || !nameInput.value || !summaryInput.value) return
    
    fetch("http://localhost:8000/talks/themes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                title: titleInput.value,
                name: nameInput.value,
                summary: summaryInput.value
            })
    })
})

// Functions

function formatTitles(data) {
    
    ul.innerHTML = ""
    
    titles = JSON.parse(data)
    
    for (let i = 0; i < titles.length; i++) {
        const li = document.createElement("li"),
        a = document.createElement("a")

        a.href = `http://localhost:8000/talks/title/${encodeURIComponent(titles[i])}`
        a.textContent = titles[i]

        li.appendChild(a)
        ul.appendChild(li)
    }
}