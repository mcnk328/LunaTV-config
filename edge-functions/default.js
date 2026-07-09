// 引入原项目的 Cloudflare Worker 逻辑
import worker from '../_worker.js';

export default async function (request, context) {
  // EdgeOne 函数接收 request 和 context 两个参数
  // 而 Cloudflare Worker 接收 request, env, ctx 三个参数
  
  // 1. 构造一个模拟的 env 对象。
  // 原项目可能会尝试读取 env.CONFIG_KV，提供空对象可以防止代码因找不到 env 而报错崩溃。
  const env = {}; 
  
  try {
    // 2. 将请求透传给原项目的 fetch 处理函数，并返回结果
    return await worker.fetch(request, env, context);
  } catch (error) {
    // 3. 错误兜底
    return new Response(JSON.stringify({
      error: "EdgeOne Adapter Error",
      message: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
