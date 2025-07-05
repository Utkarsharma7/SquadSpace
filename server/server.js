const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for workspaces
const workspaces = {};

// REST endpoint: Get workspace data
app.get('/api/workspace/:key', (req, res) => {
  const key = req.params.key;
  if (!workspaces[key]) {
    // Create workspace if it doesn't exist
    workspaces[key] = { messages: [], tasks: [], members: [] };
  }
  res.json(workspaces[key]);
});

// REST endpoint: Add message to workspace
app.post('/api/workspace/:key/message', (req, res) => {
  const key = req.params.key;
  const { user, message, time } = req.body;
  if (!workspaces[key]) workspaces[key] = { messages: [], tasks: [], members: [] };
  const msg = { user, message, time };
  workspaces[key].messages.push(msg);
  io.to(key).emit('new-message', msg);
  res.status(201).json({ success: true });
});

// REST endpoint: Add task to workspace
app.post('/api/workspace/:key/task', (req, res) => {
  const key = req.params.key;
  const { title, assignee, status, priority } = req.body;
  if (!workspaces[key]) workspaces[key] = { messages: [], tasks: [], members: [] };
  const task = { id: Date.now(), title, assignee, status, priority };
  workspaces[key].tasks.push(task);
  io.to(key).emit('new-task', task);
  res.status(201).json({ success: true });
});

// Socket.IO: Join workspace room and handle real-time events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-workspace', (key, user) => {
    socket.join(key);
    // Add member to workspace
    if (!workspaces[key]) workspaces[key] = { messages: [], tasks: [], members: [] };
    if (user && !workspaces[key].members.find(m => m.name === user.name)) {
      workspaces[key].members.push(user);
      io.to(key).emit('members-update', workspaces[key].members);
    }
  });

  socket.on('send-message', ({ key, user, message }) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!workspaces[key]) workspaces[key] = { messages: [], tasks: [], members: [] };
    const msg = { user, message, time };
    workspaces[key].messages.push(msg);
    io.to(key).emit('new-message', msg);
  });

  socket.on('add-task', ({ key, task }) => {
    if (!workspaces[key]) workspaces[key] = { messages: [], tasks: [], members: [] };
    workspaces[key].tasks.push(task);
    io.to(key).emit('new-task', task);
  });

  socket.on('disconnect', () => {
    // Optionally handle member removal
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});