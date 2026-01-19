# Quick Start Guide - College Cupid

Get up and running with College Cupid in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Microsoft OAuth

### Register App in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **+ New registration**
4. Fill in:
   - **Name**: College Cupid
   - **Account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: Select "Single-page application (SPA)" and enter `http://localhost:3000`
5. Click **Register**
6. Copy the **Application (client) ID**

### Configure Your App

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Client ID:
```env
REACT_APP_MICROSOFT_CLIENT_ID=paste-your-client-id-here
REACT_APP_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/common
REACT_APP_REDIRECT_URI=http://localhost:3000
```

## 3. Start the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 4. Test Login

1. Click **"Sign in with Microsoft"**
2. Log in with your Microsoft account
3. Grant permissions when prompted
4. You'll be redirected to the dashboard!

## Need Help?

- 📖 Detailed setup: See [OAUTH_SETUP.md](./OAUTH_SETUP.md)
- 🐛 Troubleshooting: Check the troubleshooting section in OAUTH_SETUP.md
- ❓ Common Issues:
  - **Popup blocked?** Allow popups or use "Sign in with Redirect"
  - **Changes not working?** Restart the dev server (`npm start`)
  - **Wrong redirect URL?** Make sure it matches in both Azure Portal and `.env`

## What's Next?

After successful login, you can:
- View your Microsoft profile information
- Explore the dashboard features
- Start building your matching algorithm
- Customize the UI to your preferences

Happy coding! 💝