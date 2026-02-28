/**
 * Substore Script: 显示入口城市+运营商
 * 格式示例: 香港 01 [广州电信]
 */
async function operator(proxies) {
  const queryTasks = proxies.map(async (proxy) => {
    try {
      const server = proxy.server;
      // 使用 ip-api 查询，语言设为中文
      const res = await fetch(`http://ip-api.com/json/${server}?lang=zh-CN`);
      const data = await res.json();

      if (data && data.status === 'success') {
        // 简写运营商名称
        let isp = data.isp;
        if (isp.includes('Telecom')) isp = '电信';
        else if (isp.includes('Unicom')) isp = '联通';
        else if (isp.includes('Mobile')) isp = '移动';
        else if (isp.includes('Education')) isp = '教育网';
        
        // 拼接城市和简写的运营商
        const tag = `${data.city}${isp}`;
        proxy.name = `${proxy.name} [${tag}]`;
      }
    } catch (e) {
      // 失败时不修改名称，保持原始状态
    }
    return proxy;
  });

  return await Promise.all(queryTasks);
}
