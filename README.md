# Collaborative Task Board

A real-time collaborative Kanban board built with React, Next.js, and Socket.io.

## 🚀 Description

This project is a real-time collaborative Kanban board that allows multiple users to interact simultaneously. It implements basic authentication, efficient real-time data handling, and an intuitive and attractive interface.

To facilitate the execution of the project, both the front end and the back end are included within the same repository.

## 🛠️ Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS, React DnD (for drag and drop)
- **Real-time Communication**: Socket.io
- **Backend**: Node.js, http, socket.io, next
- **Testing**: Jest, React Testing Library

## 📺 Installation

### **1. Clone the Repository**

```sh
git clone https://github.com/sebaVergara7/Outbuild-Test-FrontEnd.git
cd Outbuild-Test-FrontEnd
```

### **2. Install Dependencies**

```sh
npm install
```

### **3. Install Dependencies**

```sh
node server.js
# or
npm run server
```

### **4. Start the Next.js Application**

In another terminal, run:

```sh
npm run dev
```

### **5. Open the Browser**

Open the browser at http://localhost:3000

## 🧪 Testing

To run tests, use:

```sh
npm test
```

## 🗂️ Project Structure

```
/
├── components/        # React components
│   ├── Board/         # Board components
│   ├── Column/        # Column components
│   ├── Task/          # Task components
│   └── UserPresence/  # Connected users indicators components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── pages/             # Next.js pages
├── public/            # Static files
├── styles/            # CSS styles
├── tests/             # Tests
└── server.ts          # WebSocket server
```

🚀 **Ready for production!**

## 📋 Technical Decisions

### Architecture

- Context API: Used to manage the global state of the application, including tasks, columns, and user presence.
- WebSockets: Socket.io was chosen for real-time communication due to its ease of use and ability to handle reconnections automatically.
- Tailwind CSS: Provides a consistent design system and makes it easy to create an attractive interface with minimal code.

### Concurrency Handling

- Implementation of a "soft lock" system that shows visual indicators when a user is editing a task.
- Tasks being edited by other users cannot be moved or edited until they are released.

### UX/UI

- Visual feedback for real-time actions (highlighting tasks being edited, connected user indicators).
- Clean interface with adequate contrast to improve readability.
- Smooth transitions for task movements.

### How to Test Real-Time Collaboration

To test the real-time collaboration functionality:

1. Open the application in two or more different browsers (or incognito windows).
2. You will be automatically assigned an ID and username.
3. Make changes in one window (create, edit, or move tasks) and observe how they automatically sync in the other windows.
4. When a user starts editing or moving a task, observe how a visual indicator appears in the other windows.

## 🚧 Known Limitations

- Data only persists in localStorage.
- Authentication is basic, using localStorage to identify users.

## 🌟 Possible Future Improvements

- Implement data persistence using a database.
- Add robust authentication.
- Allow users to customize columns.
- Implement task filters and search.
- Add tags and priorities to tasks.
- Implement a change history and undo/redo system.

## 🐞 Known Issues

### Deprecated Dependencies

- `inflight@1.0.6`: This module is not supported and leaks memory. It is recommended to use `lru-cache` for a more comprehensive and powerful way to coalesce async requests by a key value.
- `glob@7.2.3`: Glob versions prior to v9 are no longer supported.
- `domexception@4.0.0`: Use your platform's native DOMException instead.
- `abab@2.0.6`: Use your platform's native atob() and btoa() methods instead.

We are working to resolve these warnings in future updates of the project. In the meantime, these warnings should not affect the functionality of the project.
