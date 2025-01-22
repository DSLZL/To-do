export default async (req, res) => {
    const { accessToken } = req.query;
  
    try {
      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/todo/lists',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`Microsoft API 返回错误: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ 
        error: '获取任务列表失败',
        details: error.message 
      });
    }
  };