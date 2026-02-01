
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Configuration ---
// 請確保在 Supabase Dashboard -> Settings -> Edge Functions 
// 設定這三個環境變數：
// 1. LINE_CHANNEL_ACCESS_TOKEN
// 2. LINE_CHANNEL_SECRET
// 3. DEEPSEEK_API_KEY
// 4. SUPABASE_URL (預設會有)
// 5. SUPABASE_SERVICE_ROLE_KEY (預設會有)

const CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") || "";
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || "";

const SYSTEM_PROMPT = `
你現在是【WashPet 寵物美容平台】的貼身管家（你可以自稱「汪管家」或「喵小編」）。

你的個性：
- 幽默風趣，偶爾會開一點無傷大雅的玩笑（例如：「你的狗狗如果太帥，我們不負責被隔壁小花倒追喔！」）。
- 輕鬆自然，不要像傳統客服機器人那樣死板。
- 充滿愛心，把每一隻毛小孩都當成自己的家人。

你的任務：
1. 引導客戶去網站預約（這是最重要的！）。
2. 解答關於洗澡、美容的問題。

重要資訊：
- 官方預約網址： http://groom.now
- 服務項目：到府洗澡、大美容、SPA 護理
- 服務特色：不關籠、使用低敏洗劑、美容師皆經過嚴格篩選。

**注意：**
- 不需要主動承諾「全程錄影」（除非客人特別問起，才說我們可以配合）。
- 如果客人問太專業的醫療問題，請幽默地建議他找獸醫（例如：「這個可能要請穿白袍的醫生叔叔看喔，我只會拿剪刀 XD」）。

如果客戶想預約，請給網址：http://groom.now
`;

serve(async (req) => {
  try {
    // 1. 驗證請求
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    const events = body.events;

    if (!events || events.length === 0) {
      return new Response("OK", { status: 200 });
    }

    // 2. 處理每個事件
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;
        const userId = event.source.userId;

        console.log(`收到訊息 (${userId}): ${userMessage}`);

        // 3. 呼叫 DeepSeek
        let replyText = "抱歉，我現在有點忙不過來，請稍後再試。";
        try {
          replyText = await callDeepSeek(userMessage);
        } catch (e) {
          console.error("DeepSeek Error:", e);
          replyText = "系統維護中，請直接點擊選單預約服務。";
        }

        // 4. 回覆 LINE
        await replyToLine(replyToken, replyText);
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// --- Helper Functions ---

async function callDeepSeek(userMessage: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("Missing DEEPSEEK_API_KEY");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      stream: false
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function replyToLine(replyToken: string, text: string) {
  if (!CHANNEL_ACCESS_TOKEN) {
    console.error("Missing LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: "text", text: text }]
    })
  });

  if (!response.ok) {
    console.error("LINE Reply Error:", await response.text());
  } else {
    console.log("✅ 已回覆訊息");
  }
}
