export default async (req, res) => {
    console.log('请求方法:', req.method);
    console.log('完整 URL:', req.url);
  
    const { accessToken } = req.query;
    console.log('访问令牌:', accessToken ? '存在' : '缺失');
  
    try {
      const apiUrl = 'https://graph.microsoft.com/v1.0/me/todo/lists';
      console.log('请求 Microsoft Graph:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('响应状态:', response.status);
      const rawData = await response.text();
      console.log('原始响应:', rawData.substring(0, 200)); // 截取部分内容
  
      if (!response.ok) {
        throw new Error(`Microsoft 接口异常: ${response.status} ${response.statusText}`);
      }
  
      const data = JSON.parse(rawData);
      res.status(200).json(data);
    } catch (error) {
      console.error('完整错误轨迹:', error.stack);
      res.status(500).json({
        error: '服务端异常',
        requestId: req.headers['x-vercel-id'],
        details: process.env.NODE_ENV === 'production' ? '请联系管理员' : error.message
      });
    }
  };