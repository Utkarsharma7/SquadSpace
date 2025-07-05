# Squad-Space 🚀

A real-time project collaboration tool built with React, Node.js, and Socket.IO. Squad-Space enables teams to work together seamlessly with features like real-time chat, task management, time tracking, and team member coordination.

![Squad-Space](https://img.shields.io/badge/React-19.1.0-blue)
![Squad-Space](https://img.shields.io/badge/Node.js-Express-green)
![Squad-Space](https://img.shields.io/badge/Socket.IO-Real--time-orange)
![Squad-Space](https://img.shields.io/badge/TailwindCSS-4.1.11-purple)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Chat**: Instant messaging with team members
- **Task Management**: Create, assign, and track project tasks
- **Time Tracking**: Built-in timer for project time management
- **Team Collaboration**: Real-time updates across all team members
- **Workspace Management**: Create or join workspaces with unique keys

### 🎨 User Interface
- **Modern Dark Theme**: Sleek black and gray interface with blue accents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Updates**: Live updates without page refresh

### 🔧 Technical Features
- **WebSocket Integration**: Real-time communication using Socket.IO
- **RESTful API**: Backend API for data persistence
- **Component Optimization**: Memoized handlers for smooth user experience
- **State Management**: Efficient React state management

### Screenshots ![Screenshot 2025-07-05 122249](https://github.com/user-attachments/assets/2f9b9ca5-d002-4c85-a785-261f777b7eba)
image(![Screenshot 2025-07-05 122305](https://github.com/user-attachments/assets/07f56e6d-df73-44ca-a09d-d7054e68d901))


## 🏗️ Architecture

```
Squad-Space/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                 # Node.js backend
│   ├── server.js          # Express server with Socket.IO
│   └── package.json       # Backend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Squad-Space
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node server.js
   ```
   The server will start on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to access the application

## 📖 Usage Guide

### Getting Started

1. **Create or Join a Workspace**
   - Enter your name and email
   - Choose to create a new workspace or join an existing one
   - If joining, enter the workspace key provided by your team

2. **Dashboard Overview**
   - View project statistics (total tasks, completed tasks, team members, time tracked)
   - See recent activity and active tasks
   - Quick access to all features

3. **Team Chat**
   - Send real-time messages to your team
   - Messages appear instantly for all team members
   - Scroll through message history

4. **Task Management**
   - Create new tasks with titles
   - Assign tasks to team members
   - Mark tasks as completed
   - View task status and priority

5. **Time Tracking**
   - Start/stop project timer
   - Track development time
   - Reset timer when needed

6. **Team Members**
   - View all team members
   - See member status (online/offline)
   - Track team collaboration

### Workspace Keys

- **Creating a workspace**: A unique key is automatically generated
- **Joining a workspace**: Use the key shared by your team leader
- **Sharing**: Share the workspace key with team members to collaborate

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **TailwindCSS 4.1.11**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **CORS**: Cross-origin resource sharing

## 🔧 Development

### Available Scripts

**Frontend (client/)**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend (server/)**
```bash
node server.js   # Start the server
```

### Project Structure

```
client/src/
├── App.jsx              # Main application component
│   ├── LoginView        # User authentication and workspace setup
│   ├── DashboardView    # Main dashboard with navigation
│   ├── ChatContent      # Real-time chat functionality
│   ├── TasksContent     # Task management interface
│   ├── MembersContent   # Team member display
│   └── TimerContent     # Time tracking component
├── main.jsx             # React entry point
└── index.css            # Global styles and Tailwind imports

server/
├── server.js            # Express server with Socket.IO setup
└── package.json         # Backend dependencies
```

## 🌟 Key Features Explained

### Real-time Communication
- Uses Socket.IO for instant message delivery
- Automatic workspace joining and member management
- Live updates for tasks, messages, and member status

### State Management
- Optimized React state with memoized handlers
- Prevents unnecessary re-renders and focus loss
- Efficient component updates

### User Experience
- Fixed layout prevents screen shifting
- Smooth input handling without focus loss
- Responsive design for all screen sizes

## 🔒 Security Considerations

- CORS enabled for development
- Input validation on both client and server
- Secure workspace key generation
- No sensitive data stored in plain text

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd server
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
# Ensure environment variables are set
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Socket.IO for real-time capabilities
- TailwindCSS for the beautiful styling system
- Lucide for the beautiful icons

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Built with ❤️ for better team collaboration** 
