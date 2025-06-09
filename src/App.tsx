import React, { useState, useEffect } from 'react';
import { Story } from './types/Story';
import { storyService } from './services/storyService';
import './App.css';

const DEPARTMENTS = ['IT', 'Business', 'Design', 'Engineering'];

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    department: 'IT',
    author: ''
  });

  useEffect(() => {
    fetchStories();
  }, [selectedDepartment]);

  const fetchStories = async () => {
    try {
      const response = selectedDepartment 
        ? await storyService.getStoriesByDepartment(selectedDepartment)
        : await storyService.getAllStories();
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storyService.createStory(newStory);
      setNewStory({ title: '', content: '', department: 'IT', author: '' });
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storyService.deleteStory(id);
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📰 VIA Tabloid</h1>
        <p>Sensational Stories from VIA Departments</p>
      </header>

      <main>
        {/* Department Filter */}
        <div className="filter-section">
          <label>Filter by Department: </label>
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Add Story Form */}
        <div className="add-story-section">
          <h2>Submit a Story</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Story Title"
              value={newStory.title}
              onChange={(e) => setNewStory({...newStory, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Story Content"
              value={newStory.content}
              onChange={(e) => setNewStory({...newStory, content: e.target.value})}
              required
            />
            <select
              value={newStory.department}
              onChange={(e) => setNewStory({...newStory, department: e.target.value})}
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Your Name"
              value={newStory.author}
              onChange={(e) => setNewStory({...newStory, author: e.target.value})}
              required
            />
            <button type="submit">Publish Story</button>
          </form>
        </div>

        {/* Stories Display */}
        <div className="stories-section">
          <h2>Latest Stories ({stories.length})</h2>
          {stories.length === 0 ? (
            <p>No stories yet. Be the first to submit one!</p>
          ) : (
            stories.map(story => (
              <div key={story.id} className="story-card">
                <h3>{story.title}</h3>
                <p className="story-meta">
                  By {story.author} | Department: {story.department}
                </p>
                <p>{story.content}</p>
                <button 
                  onClick={() => story.id && handleDelete(story.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;