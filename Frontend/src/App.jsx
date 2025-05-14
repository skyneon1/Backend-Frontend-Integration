import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newJoke, setNewJoke] = useState("");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [liking, setLiking] = useState({});

  const fetchJokes = () => {
    setLoading(true);
    axios.get('http://localhost:3000/api/jokes')
      .then(function(response){
        setJokes(response.data);
        setError(null);
      }).catch(function(){
        setError("Failed to load jokes.");
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const handleAddJoke = (e) => {
    e.preventDefault();
    if (!newJoke.trim()) return;
    setAdding(true);
    axios.post('http://localhost:3000/api/jokes', { j1: newJoke })
      .then(() => {
        setNewJoke("");
        fetchJokes();
      })
      .catch(() => setError("Failed to add joke."))
      .finally(() => setAdding(false));
  };

  const handleLike = (id) => {
    setLiking(l => ({ ...l, [id]: true }));
    axios.post(`http://localhost:3000/api/jokes/${id}/like`)
      .then(() => fetchJokes())
      .catch(() => setError("Failed to like joke."))
      .finally(() => setLiking(l => ({ ...l, [id]: false })));
  };

  const filteredJokes = jokes.filter(joke => joke.j1.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <h1>Joke Hub</h1>
      <form className="add-form" onSubmit={handleAddJoke}>
        <input
          type="text"
          placeholder="Add a new joke..."
          value={newJoke}
          onChange={e => setNewJoke(e.target.value)}
          disabled={adding}
        />
        <button type="submit" disabled={adding || !newJoke.trim()}>{adding ? "Adding..." : "Add Joke"}</button>
      </form>
      <input
        className="search-bar"
        type="text"
        placeholder="Search jokes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="loader">Loading jokes...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="joke-list">
          {filteredJokes.length === 0 ? (
            <div className="no-jokes">No jokes found.</div>
          ) : filteredJokes.map((joke) => (
            <div className="joke-card" key={joke.id}>
              <div className="joke-text">{joke.j1}</div>
              <div className="joke-actions">
                <button onClick={() => handleLike(joke.id)} disabled={liking[joke.id]}>👍 {joke.likes}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App

