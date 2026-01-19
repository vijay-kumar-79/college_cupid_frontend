# Microsoft OAuth Setup Guide for College Cupid

This guide will walk you through setting up Microsoft OAuth authentication for the College Cupid application.

## Prerequisites

- A Microsoft account (personal or organizational)
- Access to Azure Portal (https://portal.azure.com)
- Node.js and npm installed

## Step 1: Register Your Application in Azure Portal

1. **Go to Azure Portal**
   - Navigate to [https://portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Access Azure Active Directory**
   - In the left sidebar, click on "Azure Active Directory" (or search for it)
   - If you don't see it, click "More services" and search for "Azure Active Directory"

3. **Register a New Application**
   - Click on "App registrations" in the left menu
   - Click "+ New registration" at the top
   - Fill in the following details:
     - **Name**: `College Cupid` (or your preferred name)
     - **Supported account types**: Choose one of:
       - "Accounts in any organizational directory and personal Microsoft accounts" (recommended for testing)
       - "Accounts in this organizational directory only" (for single tenant)
     - **Redirect URI**: 
       - Platform: `Single-page application (SPA)`
       - URI: `http://localhost:3000`
   - Click "Register"

4. **Note Your Application (client) ID**
   - After registration, you'll be redirected to the app overview page
   - Copy the **Application (client) ID** - you'll need this later
   - Copy the **Directory (tenant) ID** if using single-tenant

## Step 2: Configure Authentication Settings

1. **Add Additional Redirect URIs** (if needed)
   - In your app registration, click "Authentication" in the left menu
   - Under "Single-page application" section, click "+ Add URI"
   - Add your production URL when deploying (e.g., `https://yourdomain.com`)
   - Under "Implicit grant and hybrid flows", ensure these are checked:
     - ✅ Access tokens (used for implicit flows)
     - ✅ ID tokens (used for implicit and hybrid flows)
   - Click "Save"

2. **Configure API Permissions**
   - Click "API permissions" in the left menu
   - You should see `Microsoft Graph > User.Read` already added
   - If not, click "+ Add a permission":
     - Select "Microsoft Graph"
     - Select "Delegated permissions"
     - Search for and check "User.Read"
     - Click "Add permissions"
   - Optionally, click "Grant admin consent" if you're an admin

## Step 3: Configure Your Application

1. **Create Environment File**
   - In the project root, copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```

2. **Update Environment Variables**
   - Open `.env` file and update the following:
     ```env
     REACT_APP_MICROSOFT_CLIENT_ID=your-application-client-id
     REACT_APP_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/common
     REACT_APP_REDIRECT_URI=http://localhost:3000
     ```
   
   - For single-tenant applications, use your tenant ID:
     ```env
     REACT_APP_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
     ```

3. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

## Step 4: Test Your Application

1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Test Login Flow**
   - Navigate to `http://localhost:3000`
   - Click "Sign in with Microsoft"
   - You'll be redirected to Microsoft login
   - Sign in with your Microsoft account
   - Grant permissions when prompted
   - You should be redirected back to the dashboard

## Authentication Flow

The application uses two login methods:

1. **Popup Login** (Default)
   - Opens Microsoft login in a popup window
   - Better user experience, no page navigation
   - Click "Sign in with Microsoft" button

2. **Redirect Login** (Alternative)
   - Redirects entire page to Microsoft login
   - More compatible with some browsers/policies
   - Click "Sign in with Redirect" button

## Troubleshooting

### Error: "AADSTS50011: The reply URL specified in the request does not match"
- **Solution**: Ensure the redirect URI in Azure Portal matches exactly with your application URL
- Check both the protocol (http/https) and port number

### Error: "AADSTS700016: Application with identifier was not found"
- **Solution**: Double-check your Client ID in the `.env` file
- Ensure you're using the Application (client) ID, not the Object ID

### Login popup is blocked
- **Solution**: Allow popups for localhost in your browser settings
- Alternatively, use the "Sign in with Redirect" option

### Error: "User.Read permission not granted"
- **Solution**: In Azure Portal, go to API permissions and ensure User.Read is added
- Click "Grant admin consent for [your directory]"

### Changes to .env file not reflecting
- **Solution**: Restart the development server
- React apps need to be restarted to pick up new environment variables

## Security Best Practices

1. **Never commit `.env` file to version control**
   - It's already in `.gitignore`
   - Always use `.env.example` as a template

2. **Use Environment-Specific Configuration**
   - Development: `http://localhost:3000`
   - Production: Your production domain with HTTPS

3. **Restrict Redirect URIs**
   - Only add necessary redirect URIs in Azure Portal
   - Remove unused URIs to prevent security issues

4. **Limit API Permissions**
   - Only request permissions your app actually needs
   - Review and remove unnecessary scopes

## Production Deployment

When deploying to production:

1. **Update Redirect URI in Azure Portal**
   - Add your production URL (e.g., `https://collegecupid.com`)
   - Use HTTPS for all production URLs

2. **Update Environment Variables**
   - Set `REACT_APP_REDIRECT_URI` to your production URL
   - Ensure all environment variables are set in your hosting platform

3. **Build the Application**
   ```bash
   npm run build
   ```

4. **Test Authentication**
   - Verify login/logout works on production
   - Test with different account types if using multi-tenant

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

## Support

If you encounter issues:

1. Check the browser console for error
 messages
2. Verify all configuration steps above
3. Review Azure Portal app registration settings
4. Check that all required packages are installed

## Next Steps

After successful authentication setup:

- Customize the dashboard with your app features
- Implement additional Microsoft Graph API calls
- Add role-based access control
- Implement user profile management
- Set up backend API integration