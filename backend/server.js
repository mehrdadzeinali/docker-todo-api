const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Stockage en mémoire (simple pour débuter)
let tasks = [
  { id: 1, title: "Apprendre Docker", completed: false },
  { id: 2, title: "Créer une API", completed: true }
];
let nextId = 3;

// Routes

// GET /tasks - Récupérer toutes les tâches
app.get('/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    count: tasks.length
  });
});

// GET /tasks/:id - Récupérer une tâche par ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Tâche non trouvée"
    });
  }
  
  res.json({
    success: true,
    data: task
  });
});

// POST /tasks - Créer une nouvelle tâche
app.post('/tasks', (req, res) => {
  const { title, completed = false } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "Le titre est requis"
    });
  }
  
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    data: newTask,
    message: "Tâche créée avec succès"
  });
});

// PUT /tasks/:id - Modifier une tâche
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Tâche non trouvée"
    });
  }
  
  const { title, completed } = req.body;
  
  if (title !== undefined) {
    tasks[taskIndex].title = title.trim();
  }
  if (completed !== undefined) {
    tasks[taskIndex].completed = completed;
  }
  
  res.json({
    success: true,
    data: tasks[taskIndex],
    message: "Tâche mise à jour avec succès"
  });
});

// DELETE /tasks/:id - Supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Tâche non trouvée"
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTask,
    message: "Tâche supprimée avec succès"
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée"
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📋 API disponible sur http://localhost:${PORT}/tasks`);
  console.log(`💚 Health check sur http://localhost:${PORT}/health`);
});