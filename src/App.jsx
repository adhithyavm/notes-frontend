import { useState, useEffect } from 'react'
import './App.css'
import AuthPage from './auth/AuthPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchNotes();
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title || !content) return

    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await fetch(`http://localhost:5000/api/notes/${editingId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, content, category })
        })
      } else {
        await fetch('http://localhost:5000/api/notes', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, content, category })
        })
      }
      
      setTitle('')
      setContent('')
      setCategory('general')
      setEditingId(null)
      fetchNotes()
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleEdit = (note) => {
    setTitle(note.title)
    setContent(note.content)
    setCategory(note.category)
    setEditingId(note._id)
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Notes App</h1>
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <button type="submit">
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <span className="category">{note.category}</span>
            <div className="note-actions">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
