class Theme {
    constructor(title, creator, summary) {
        this.title = title
        this.creator = creator
        this.summary = summary
        this.comments = []
    }
}

class Comment {
    constructor(name, text) {
        this.name = name
        this.text = text
    }
}

module.exports = {
    Theme: Theme,
    Comment: Comment
}