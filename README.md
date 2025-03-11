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

### **3. Start the Node.js WebSocket Server**

```sh
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
OUTBUILD-TEST-FRONTEND/
│── __mocks__/              # External libraries mocks
│── __tests__/              # Automated tests
│── .husky/                 # Husky configuration
│── node_modules/           # Project dependencies
│── public/                 # Static files
│── src/                    # Main source code
│   ├── actions/            # React context actions
│   ├── components/         # React components
│   │   ├── Board/          # Board components
│   │   ├── Column/         # Column components
│   │   ├── Task/           # Task components
│   │   └── UserPresence/   # Connected users indicators components
│   ├── contexts/           # React contexts
│   ├── handlers/           # React context handlers
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS styles
│   ├── utils/              # Common utils
│── eslint.config.mjs       # Eslint configuration
│── jest.config.js          # Jest configuration for testing
│── jest.setup.js           # Jest dom setup
│── next.config.ts          # Next configuration
│── package-lock.json       # Dependency lock file
│── package.json            # Node.js project configuration
│── postcss.config.js       # PostCSS configuration
│── README.md               # Project documentation
│── server.ts               # WebSocket server
│── tailwind.config.js      # Tailwind CSS configuration
│── tsconfig.jest.json      # TypeScript Jest configuration
└── tsconfig.json           # TypeScript configuration
```

🚀 **Ready for production!**

## 📋 Technical Decisions

### Architecture

- Context API: Used to manage the global state of the application, including tasks, columns, and user presence.
- WebSockets: Socket.io was chosen for real-time communication due to its ease of use and ability to handle reconnections automatically.
- Tailwind CSS: Provides a consistent design system and makes it easy to create an attractive interface with minimal code.

### Concurrency Handling

- Implementation of a "soft lock" system that shows visual indicators when a user is editing or moving a task.
- Tasks that are being edited or moved by other users cannot be moved or edited until they are released.

### UX/UI

- Visual feedback for real-time actions (highlighting tasks being edited, tasks being moved, connected user indicators).
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

### Experimental Warning

```
- (node:1720) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
- (node:1720) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///path/to/project/server.ts is not specified and it doesn't parse as CommonJS. Reparsing as ES module because module syntax was detected. This incurs a performance overhead. To eliminate this warning, add "type": "module" to your package.json.
```

This warning appears because both the frontend and backend are included in the same project. To eliminate this warning, you can either add `"type": "module"` to the `package.json` file or separate the backend into a different project.

These warnings should not affect the functionality of the project.
