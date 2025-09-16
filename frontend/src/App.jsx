import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTasks();
  }, []);

  // Récupérer toutes les tâches
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const result = await response.json();
      
      if (result.success) {
        setTasks(result.data);
      } else {
        setError('Erreur lors du chargement des tâches');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une nouvelle tâche
  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          completed: false
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTasks([...tasks, result.data]);
        setNewTaskTitle('');
      } else {
        setError(result.message || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur:', err);
    }
  };

  // Basculer le statut completed d'une tâche
  const toggleTask = async (taskId, currentCompleted) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentCompleted
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? result.data : task
        ));
      } else {
        setError(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur:', err);
    }
  };

  // Modifier le titre d'une tâche
  const updateTaskTitle = async (taskId, newTitle) => {
    if (!newTitle.trim()) return;

    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim()
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? result.data : task
        ));
        setEditingTask(null);
      } else {
        setError(result.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur:', err);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (taskId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        setError(result.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur:', err);
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📋 Todo App</h1>
          <p className="subtitle">
            {completedCount} sur {totalCount} tâches terminées
          </p>
        </header>

        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        <div className="add-task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="task-input"
            disabled={loading}
          />
          <button type="button" onClick={addTask} className="add-button" disabled={loading || !newTaskTitle.trim()}>
            {loading ? '⏳' : '➕'} Ajouter
          </button>
        </div>

        <div className="tasks-container">
          {loading && tasks.length === 0 ? (
            <div className="loading">⏳ Chargement des tâches...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>🎉 Aucune tâche pour le moment !</p>
              <p>Ajoutez-en une ci-dessus pour commencer.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.completed)}
                      className="task-checkbox"
                    />
                    
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        defaultValue={task.title}
                        className="task-edit-input"
                        autoFocus
                        onBlur={(e) => updateTaskTitle(task.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateTaskTitle(task.id, e.target.value);
                          }
                          if (e.key === 'Escape') {
                            setEditingTask(null);
                          }
                        }}
                      />
                    ) : (
                      <span 
                        className="task-title"
                        onClick={() => setEditingTask(task.id)}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>
                  
                  <div className="task-actions">
                    <button
                      onClick={() => setEditingTask(task.id)}
                      className="edit-button"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-button"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <button onClick={fetchTasks} className="refresh-button" disabled={loading}>
            🔄 Actualiser
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
