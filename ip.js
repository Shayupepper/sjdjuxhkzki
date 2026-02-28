async function operator(proxies) {
  // 限制并发数，防止被 API 封禁
  const limit = 5; 
  for (let i = 0; i < proxies.length; i += limit) {
    const chunk = proxies.slice(i, i + limit);
    await Promise.all(chunk.map(async (proxy) => {
      try {
        const res = await fetch(`http://ip-api.com/json/${proxy.server}?lang=zh-CN`, { timeout: 2000 });
        const data = await res.json();
        if (data && data.status === 'success') {
          let isp = data.isp || '';
          if (isp.includes('Telecom')) isp = '电信';
          else if (isp.includes('Unicom')) isp = '联通';
          else if (isp.includes('Mobile')) isp = '移动';
          else isp = isp.substring(0, 4); // 其他运营商取前4位
          
          proxy.name = `${proxy.name} [${data.city}${isp}]`;
        }
      } catch (e) {
        // 忽略错误，保证节点能正常显示
      }
    }));
  }
  return proxies;
}
