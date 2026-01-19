# College Cupid Frontend

A React-based dating application for college students with Microsoft OAuth authentication.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- 🔐 Microsoft OAuth 2.0 Authentication
- 👤 User Profile Integration via Microsoft Graph API
- 🎨 Modern, Responsive UI Design
- 🔄 Popup and Redirect Login Options
- 📱 Mobile-Friendly Interface

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Microsoft Azure account (for OAuth setup)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Microsoft OAuth (see detailed guide in [OAUTH_SETUP.md](./OAUTH_SETUP.md)):
   - Create an app registration in Azure Portal
   - Copy `.env.example` to `.env`
   - Add your Microsoft Client ID and configuration

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Microsoft OAuth Setup

For detailed instructions on setting up Microsoft OAuth authentication, please refer to [OAUTH_SETUP.md](./OAUTH_SETUP.md).

### Quick Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Azure app credentials:
   ```env
   REACT_APP_MICROSOFT_CLIENT_ID=your-client-id-here
   REACT_APP_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/common
   REACT_APP_REDIRECT_URI=http://localhost:3000
   ```

## Project Structure

```
src/
├── config/
│   └── authConfig.js       # MSAL configuration
├── pages/
│   ├── Login.js            # Login page component
│   ├── Login.css           # Login page styles
│   ├── Dashboard.js        # Dashboard component
│   └── Dashboard.css       # Dashboard styles
├── components/             # Reusable components
├── App.js                  # Main app component with routing
└── index.js                # App entry point
```

## Available Scripts

## Technologies Used

- **React 19** - UI Framework
- **@azure/msal-react** - Microsoft Authentication Library
- **@azure/msal-browser** - MSAL Browser Support
- **react-router-dom** - Routing
- **Microsoft Graph API** - User data integration

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
