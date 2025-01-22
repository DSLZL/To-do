export default async (req, res) => {
    console.log('请求头:', req.headers);
    console.log('访问令牌:', req.query.accessToken);

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

        console.log('API 响应状态:', response.status);
        const responseText = await response.text();
        console.log('原始响应数据:', responseText);

        if (!response.ok) {
            throw new Error(`Microsoft API 返回错误: ${response.statusText}`);
        }

        const data = JSON.parse(responseText);
        res.status(200).json(data);
    } catch (error) {
        console.error('完整错误信息:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: '获取任务列表失败',
            details: process.env.NODE_ENV === 'development' ? error.message : '内部服务器错误'
        });
    }
};