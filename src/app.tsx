import Logo from "./assets/logo.png"
import { NoteCard } from "./components/note-card"
import { NewNoteCard } from "./components/new-note-card"
import { ChangeEvent, useState } from "react"

interface Note {
  id: string,
  date: Date,
  content: string 
}

export function App() {

  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {
    const noteOnStoeage = localStorage.getItem("notes")
    return (noteOnStoeage)?JSON.parse(noteOnStoeage): []
  })

  function onNoteCreated(content: string) {
     const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
     } 

     const noteArray = [newNote, ...notes]

     setNotes(noteArray)

     localStorage.setItem('notes', JSON.stringify(noteArray))
  }

  function onNoteDeleted(id: string) {
    const noteArray = notes.filter(note => {
      return note.id != id
    })

    setNotes(noteArray)

     localStorage.setItem('notes', JSON.stringify(noteArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !+ ''
    ?notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    :notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <span className="text-fuchsia-500">
      <img src={Logo} alt="nlw-notes" className="size-[50px] rounded-[50%]" /> Note Paid
      </span>

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque por suas notas..."
          className="w-full bg-transparent text3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
          />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">

        <NewNoteCard onNoteCreated = {onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note}  onNoteDeleted={onNoteDeleted}/>
        })}

      </div>
    </div>
  )

}


