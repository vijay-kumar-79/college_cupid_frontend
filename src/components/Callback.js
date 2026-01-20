import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // console.log('=== AUTH CALLBACK DEBUG ===');
    // console.log('Full URL:', window.location.href);

    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const outlookInfo = params.get('outlookInfo');

    // console.log('Status:', status);
    // console.log('outlookInfo length:', outlookInfo?.length);
    // console.log('outlookInfo type:', typeof outlookInfo);

    // Log the first 200 characters to see what we're dealing with
    // if (outlookInfo) {
    //   console.log('First 200 chars of outlookInfo:', outlookInfo.substring(0, 200));
    //   console.log('Char codes at start:');
    //   for (let i = 0; i < Math.min(10, outlookInfo.length); i++) {
    //     console.log(`Position ${i}: '${outlookInfo[i]}' (char code: ${outlookInfo.charCodeAt(i)})`);
    //   }
    // }

    // Try to parse with error handling
    if (status && outlookInfo) {
      try {
        // First, try to clean the string
        let cleanString = outlookInfo;

        // Check if it starts with HTML entities
        if (cleanString.startsWith('&quot;')) {
          // console.log('Detected HTML entities at start');
          // Replace HTML entities
          cleanString = cleanString
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        }

        // Check for double stringification
        if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
          // console.log('String appears to be double-wrapped in quotes');
          // Remove the outer quotes
          cleanString = cleanString.substring(1, cleanString.length - 1);

          // If there are escaped quotes, unescape them
          cleanString = cleanString.replace(/\\"/g, '"');
        }

        // console.log('Cleaned string start:', cleanString.substring(0, 100));

        // Now try to parse
        const parsedInfo = JSON.parse(cleanString);
        // console.log('Successfully parsed:', parsedInfo);

        if (status === 'SUCCESS') {
          // Store tokens
          localStorage.setItem('accessToken', parsedInfo.accessToken);
          localStorage.setItem('refreshToken', parsedInfo.refreshToken);
          localStorage.setItem('userEmail', parsedInfo.email);
          localStorage.setItem('displayName', parsedInfo.displayName || '');
          localStorage.setItem('rollNumber', parsedInfo.rollNumber || '');
          localStorage.setItem('outlookAccessToken', parsedInfo.outlookAccessToken);
          localStorage.setItem('outlookRefreshToken', parsedInfo.outlookRefreshToken);

          navigate('/home');
        } else {
          navigate('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Parse error details:', {
          message: error.message,
          error: error,
          outlookInfo: outlookInfo
        });
        navigate('/login?error=json_parse_error');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Processing authentication...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  }
};

export default AuthCallback;
