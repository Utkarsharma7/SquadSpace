import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, CheckSquare, Clock, Settings, Plus, Send, User, Key, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:8000';
const API_URL = 'http://localhost:8000/api';

// Extract ChatContent as a separate memoized component
const ChatContent = React.memo(({ messages, newMessage, handleMessageChange, sendMessage }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Team Chat</h2>
      
      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                {msg.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-300">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-gray-400 mt-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Extract TasksContent as a memoized component
const TasksContent = React.memo(({ tasks, newTask, handleTaskChange, addTask, toggleTaskStatus }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTask}
            onChange={handleTaskChange}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add new task..."
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.status === 'completed' 
                    ? 'bg-green-600 border-green-600' 
                    : 'border-gray-600 hover:border-blue-500'
                }`}
              >
                {task.status === 'completed' && <CheckSquare className="w-4 h-4 text-white" />}
              </button>
              <div>
                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">Assigned to: {task.assignee}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs rounded-full ${
                task.status === 'completed' ? 'bg-green-900 text-green-300' :
                task.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                'bg-gray-800 text-gray-400'
              }`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'high' ? 'bg-red-900 text-red-300' :
                task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-green-900 text-green-300'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Extract DashboardContent as a memoized component
const DashboardContent = React.memo(({ user, tasks, members, timeElapsed, messages, formatTime }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold mb-2">Project Dashboard</h2>
      <p className="text-gray-400">Welcome back, {user?.name}! Here's what's happening.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <CheckSquare className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</p>
          </div>
          <CheckSquare className="w-8 h-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Team Members</p>
            <p className="text-2xl font-bold">{members.length}</p>
          </div>
          <Users className="w-8 h-8 text-purple-500" />
        </div>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Time Tracked</p>
            <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {messages.slice(-3).map(msg => (
            <div key={msg.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                {msg.user.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm text-gray-300">{msg.user} sent a message</p>
                <p className="text-xs text-gray-500">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Active Tasks</h3>
        <div className="space-y-3">
          {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
            <div key={task.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">{task.title}</p>
                <p className="text-xs text-gray-500">{task.assignee}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'high' ? 'bg-red-900 text-red-300' :
                task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-green-900 text-green-300'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

// Extract MembersContent as a memoized component
const MembersContent = React.memo(({ members }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Team Members</h2>
    
    <div className="grid gap-4">
      {members.map(member => (
        <div key={member.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-semibold">
              {member.avatar}
            </div>
            <div>
              <h3 className="font-medium text-gray-300">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              member.status === 'online' ? 'bg-green-500' : 
              member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm text-gray-400 capitalize">{member.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
));

// Extract TimerContent as a memoized component
const TimerContent = React.memo(({ timerRunning, setTimerRunning, timeElapsed, setTimeElapsed, formatTime }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Project Timer</h2>
    
    <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
      <div className="text-6xl font-mono font-bold text-blue-400 mb-6">
        {formatTime(timeElapsed)}
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setTimerRunning(!timerRunning)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            timerRunning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {timerRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={() => {
            setTimerRunning(false);
            setTimeElapsed(0);
          }}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>
      
      <div className="mt-6 text-gray-400">
        <p>Track your project development time</p>
      </div>
    </div>
  </div>
));

const ProjectCollaborationTool = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [newTask, setNewTask] = useState('');
  const socketRef = useRef(null);

  // Memoized change handlers to prevent unnecessary re-renders
  const handleMessageChange = React.useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  const handleTaskChange = React.useCallback((e) => {
    setNewTask(e.target.value);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Connect to socket.io on mount
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Join workspace and fetch data
  const handleJoinWorkspace = async (workspaceData) => {
    setWorkspace(workspaceData);
    setCurrentView('dashboard');
    // Fetch workspace data from backend
    const res = await axios.get(`${API_URL}/workspace/${workspaceData.key}`);
    setMessages(res.data.messages);
    setTasks(res.data.tasks);
    setMembers(res.data.members);
    // Join workspace room via socket
    socketRef.current.emit('join-workspace', workspaceData.key, user);
  };

  // Listen for real-time updates
  useEffect(() => {
    if (!workspace) return;
    const socket = socketRef.current;
    if (!socket) return;
    // Join room again if needed
    socket.emit('join-workspace', workspace.key, user);
    // Listen for new messages
    socket.on('new-message', (msg) => {
      // Ensure every message has a unique id with better stability
      setMessages((prev) => [
        ...prev,
        { 
          ...msg, 
          id: msg.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          time: msg.time || new Date().toLocaleTimeString()
        }
      ]);
    });
    // Listen for new tasks
    socket.on('new-task', (task) => {
      setTasks((prev) => [
        ...prev,
        { ...task, id: task.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      ]);
    });
    // Listen for members update
    socket.on('members-update', (members) => {
      setMembers(members);
    });
    return () => {
      socket.off('new-message');
      socket.off('new-task');
      socket.off('members-update');
    };
  }, [workspace, user]);

  // Send message via socket (memoized)
  const sendMessage = React.useCallback(() => {
    if (newMessage.trim() && workspace) {
      socketRef.current.emit('send-message', {
        key: workspace.key,
        user: user?.name || 'You',
        message: newMessage,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: new Date().toLocaleTimeString()
      });
      setNewMessage('');
    }
  }, [newMessage, workspace, user]);

  // Add task via socket (memoized)
  const addTask = React.useCallback(() => {
    if (newTask.trim() && workspace) {
      const task = {
        id: Date.now() + Math.random(),
        title: newTask,
        assignee: user?.name || 'Unassigned',
        status: 'pending',
        priority: 'medium'
      };
      socketRef.current.emit('add-task', {
        key: workspace.key,
        task
      });
      setNewTask('');
    }
  }, [newTask, workspace, user]);

  const toggleTaskStatus = React.useCallback((taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
    // Optionally, emit task update to backend here
  }, [tasks]);

  const formatTime = React.useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Login/Profile Setup Component
  const LoginView = () => {
    const [formData, setFormData] = useState({ name: '', email: '', workspaceKey: '' });
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

    const handleSubmit = () => {
      if (formData.name && formData.email && (isCreatingWorkspace || formData.workspaceKey)) {
        setUser(formData);
        const workspaceData = {
          name: isCreatingWorkspace ? 'My Workspace' : 'Joined Workspace',
          key: formData.workspaceKey || Math.random().toString(36).substr(2, 9)
        };
        handleJoinWorkspace(workspaceData);
      }
    };
    

    // Optimized change handlers to prevent unnecessary re-renders
    const handleNameChange = (e) => {
      setFormData(prev => ({ ...prev, name: e.target.value }));
    };

    const handleEmailChange = (e) => {
      setFormData(prev => ({ ...prev, email: e.target.value }));
    };

    const handleWorkspaceKeyChange = (e) => {
      setFormData(prev => ({ ...prev, workspaceKey: e.target.value }));
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Squad-Space</h1>
            <p className="text-gray-400">Your project collaboration hub</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsCreatingWorkspace(true)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    isCreatingWorkspace 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Create Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingWorkspace(false)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    !isCreatingWorkspace 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Join Workspace
                </button>
              </div>

              {!isCreatingWorkspace && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Workspace Key</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.workspaceKey}
                    onChange={handleWorkspaceKeyChange}
                    placeholder="Enter workspace key"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                {isCreatingWorkspace ? 'Create & Enter Workspace' : 'Join Workspace'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Dashboard Component
  const DashboardView = () => {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Squad-Space</h1>
              {workspace && (
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-lg">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{workspace.key}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{user?.name}</span>
              </div>
              <button
                onClick={() => setCurrentView('login')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <div className="flex">
          <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen">
            <nav className="p-4 space-y-2">
              {[
                { icon: CheckSquare, label: 'Dashboard', view: 'dashboard' },
                { icon: MessageCircle, label: 'Chat', view: 'chat' },
                { icon: CheckSquare, label: 'Tasks', view: 'tasks' },
                { icon: Users, label: 'Members', view: 'members' },
                { icon: Clock, label: 'Timer', view: 'timer' },
              ].map(({ icon: Icon, label, view }) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === view 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {currentView === 'dashboard' && (
              <DashboardContent 
                user={user}
                tasks={tasks}
                members={members}
                timeElapsed={timeElapsed}
                messages={messages}
                formatTime={formatTime}
              />
            )}
            {currentView === 'chat' && (
              <ChatContent 
                messages={messages}
                newMessage={newMessage}
                handleMessageChange={handleMessageChange}
                sendMessage={sendMessage}
              />
            )}
            {currentView === 'tasks' && (
              <TasksContent 
                tasks={tasks}
                newTask={newTask}
                handleTaskChange={handleTaskChange}
                addTask={addTask}
                toggleTaskStatus={toggleTaskStatus}
              />
            )}
            {currentView === 'members' && (
              <MembersContent members={members} />
            )}
            {currentView === 'timer' && (
              <TimerContent 
                timerRunning={timerRunning}
                setTimerRunning={setTimerRunning}
                timeElapsed={timeElapsed}
                setTimeElapsed={setTimeElapsed}
                formatTime={formatTime}
              />
            )}
          </main>
        </div>
      </div>
    );
  };

  // Main render logic
  if (currentView === 'login') {
    return <LoginView />;
  }

  return <DashboardView />;
};

export default ProjectCollaborationTool;