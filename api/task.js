export default async (req, res) => {
    const { listId, accessToken } = req.query;
    
    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };