const express = require("express")
const app = express()
const fs = require("fs")
const PORT = process.env.port || 10000
const path = require("path")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


app.get("/notes", (req, res)=>{
    res.sendFile(__dirname + "/public/notes.html")
})

app.get("/api/notes", (req, res)=>{
    const notes = fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data)=>{
        if (err) throw (err);
        res.json(JSON.parse(data))
    })
})

app.post("/api/notes", (req, res)=>{
    let savedNotes = fs.readFileSync(path.join(__dirname + "/db/db.json"), "utf-8")
    const parsedSavedNotes = JSON.parse(savedNotes)
    const noteAdd = req.body
    const uniqueID = function getRandomNumber(min, max){
        min = Math.ceil(1)
        max = Math.ceil(99999999999999)
        return Math.floor(Math.random()*(max-min)) + min;
    }
    noteAdd.id = uniqueID
    parsedSavedNotes.push(noteAdd);
    fs.writeFileSync(path.join(__dirname + "/db/db.json"), JSON.stringify(parsedSavedNotes))
    res.json(noteAdd)
})

app.delete("/api/notes/:id", (req, res)=>{
    let savedNotes = fs.readFileSync(path.join(__dirname + "/db/db.json"), "utf-8")
    const parsedSavedNotes = JSON.parse(savedNotes)
    const notesId = parseInt(req.params.id)
    
    let noteAdd = parsedSavedNotes.filter((allNotes)=>{
        return allNotes.id !== notesId
    })
    fs.writeFileSync(path.join(__dirname+ "/db/db.json"), JSON.stringify(noteAdd))
    console.log("succesfully deleted note.")
})

app.get("*", (req, res)=>{
    res.sendFile(__dirname + "/public/notes.html")
})

app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhost:${PORT}`)
})