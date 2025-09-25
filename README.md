# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
Katha Sangam - Project Documentation
Katha Sangam 🎭

An AI-powered cultural storytelling platform that brings mythology, folklore, and traditional stories to life using text, images, audio, and video. This project is built with React.js (frontend) and Express.js (backend).
🚀 Features
• Story generation using AI (Gemini API).
• Text-to-Speech narration.
• AI-based image and video generation.
• Smooth navigation using React Router.
• Modern UI with Material-UI and React Icons.
📂 Project Setup

1. 1. Create React Project
      npx create-react-app katha-sangam
2. 2. Go Inside Project Folder
      cd katha-sangam
3. 3. Install React Router
      npm install react-router-dom
4. 4. Install Material UI
      npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
5. 5. Install React Icons
      npm install react-icons
6. Example import
   import { FaBookOpen, FaImage, FaVolumeUp, FaVideo } from "react-icons/fa";
7. 6. Start Development Server
      npm start
      ⚙️ Backend Setup (Gemini API)
8. 1. Go to Backend Folder
      cd backend
9. 2. Initialize Node.js Project
      npm init -y
10. 3. Install Dependencies
       npm install express cors dotenv node-fetch
11. 4. Run Server
       node server.js
       🖥️ Available Scripts (Frontend)
       • npm start - Runs the app in development mode (http://localhost:3000).
       • npm test - Launches the test runner in interactive watch mode.
       • npm run build - Builds the app for production to the build folder.
       • npm run eject - Ejects configuration files. (⚠️ One-way operation)
       📖 Learn More
       • React Documentation: https://reactjs.org/
       • Create React App Documentation: https://facebook.github.io/create-react-app/docs/getting-started
       • Material-UI Docs: https://mui.com/
       • React Icons: https://react-icons.github.io/react-icons/
       🌐 Deployment
       Follow Deployment Guide: https://facebook.github.io/create-react-app/docs/deployment
       📝 Notes
       • Ensure backend is running before making API calls from frontend.
       • Add your API keys in `.env` file inside backend.
       • Start frontend and backend separately.
