export default async (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      scope: 'Tasks.Read',
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      client_secret: process.env.MICROSOFT_CLIENT_SECRET
    });
  
    try {
      const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
      
      const data = await response.json();
      res.redirect(`/?access_token=${data.access_token}`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };