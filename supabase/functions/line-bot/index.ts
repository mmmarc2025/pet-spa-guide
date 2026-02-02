
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Config ---
const CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") || "";
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- State Machine ---
const STEPS = {
  IDLE: 'idle',
  ASK_NAME: 'ask_name',
  ASK_PHONE: 'ask_phone',
  ASK_PET: 'ask_pet',
  ASK_SERVICE: 'ask_service',
  ASK_DATE: 'ask_date',
  CONFIRM: 'confirm'
};

const SYSTEM_PROMPT = `
你現在是【WashPet 寵物美容平台】的貼身管家（汪管家）。
個性：幽默、親切、愛狗愛貓。

你的任務是引導客戶完成預約。
如果客戶說「我想預約」，請引導他們進入流程。
如果是在預約流程中，請簡短確認收到的資訊，並詢問下一個問題。

重要資訊：
- 官方預約網址： https://groom.today
- 服務項目：到府洗澡、大美容、SPA 護理
- 服務特色：不關籠、使用低敏洗劑、美容師皆經過嚴格篩選。

**注意：**
- 不需要主動承諾「全程錄影」（除非客人特別問起，才說我們可以配合）。
- 如果客人問太專業的醫療問題，請幽默地建議他找獸醫（例如：「這個可能要請穿白袍的醫生叔叔看喔，我只會拿剪刀 XD」）。

如果客戶想預約，請給網址：https://groom.today
`;

serve(async (req) => {
  try {
    const body = await req.json();
    const events = body.events;
    if (!events || events.length === 0) return new Response("OK", { status: 200 });

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userId = event.source.userId;
        const userMsg = event.message.text.trim();
        const replyToken = event.replyToken;

        // 1. Get Session State
        let { data: session } = await supabase.from('chat_sessions').select('*').eq('user_id', userId).single();
        
        if (!session) {
          // New user, create session
          session = { user_id: userId, step: STEPS.IDLE, data: {} };
          await supabase.from('chat_sessions').insert(session);
        }

        let replyText = "";
        let nextStep = session.step;
        let nextData = session.data || {};

        // 2. State Machine Logic
        if (userMsg === "重來" || userMsg === "取消") {
           nextStep = STEPS.IDLE;
           nextData = {};
           replyText = "好的，預約已取消。有需要隨時叫我喔！🐶";
        } 
        else if (session.step === STEPS.IDLE) {
            if (userMsg.includes("預約") || userMsg.includes("洗澡")) {
                nextStep = STEPS.ASK_NAME;
                replyText = "沒問題！我們要開始幫毛小孩預約囉！\n請問主人您怎麼稱呼？";
            } else {
                // Normal Chat (DeepSeek)
                replyText = await callDeepSeek(userMsg, SYSTEM_PROMPT);
            }
        }
        else if (session.step === STEPS.ASK_NAME) {
            nextData.owner_name = userMsg;
            nextStep = STEPS.ASK_PHONE;
            replyText = `收到，${userMsg} 您好！\n請問您的聯絡電話是？`;
        }
        else if (session.step === STEPS.ASK_PHONE) {
            nextData.phone = userMsg;
            nextStep = STEPS.ASK_PET;
            replyText = "了解！請問是要幫什麼寵物預約呢？（例如：黃金獵犬、柴犬、波斯貓）";
        }
        else if (session.step === STEPS.ASK_PET) {
            nextData.pet_type = userMsg;
            nextStep = STEPS.ASK_SERVICE;
            replyText = "好可愛！那這次想做什麼服務呢？（洗澡、大美容、SPA？）";
        }
        else if (session.step === STEPS.ASK_SERVICE) {
            nextData.service_type = userMsg;
            nextStep = STEPS.ASK_DATE;
            replyText = "沒問題！最後請問您希望預約的時間？（例如：明天下午2點）";
        }
        else if (session.step === STEPS.ASK_DATE) {
            nextData.preferred_date_text = userMsg;
            nextStep = STEPS.IDLE; // Finish
            
            // Create Booking in DB
            const { error } = await supabase.from('bookings').insert({
                owner_name: nextData.owner_name,
                phone: nextData.phone,
                pet_type: nextData.pet_type,
                service_type: nextData.service_type,
                notes: `LINE預約 (時間: ${userMsg})`,
                status: 'pending'
            });
            
            if (error) {
                console.error("Booking Error:", error);
                replyText = "糟糕！系統寫入失敗，請稍後再試或直接聯繫客服。😰";
            } else {
                replyText = `🎉 預約申請已送出！\n\n確認資料：\n👤 ${nextData.owner_name}\n📞 ${nextData.phone}\n🐶 ${nextData.pet_type}\n✂️ ${nextData.service_type}\n🕒 ${userMsg}\n\n我們會盡快確認美容師時間並通知您！`;
            }
            nextData = {}; // Clear data
        }

        // 3. Update Session & Reply
        await supabase.from('chat_sessions').update({ step: nextStep, data: nextData }).eq('user_id', userId);
        await replyToLine(replyToken, replyText);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500 });
  }
});

// --- Helpers ---
async function callDeepSeek(msg: string, sys: string) {
    if (!DEEPSEEK_API_KEY) return "系統維護中...";
    try {
        const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: sys }, { role: "user", content: msg }],
                stream: false
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (e) {
        return "我現在有點頭暈，請稍後再跟我聊天 😵‍💫";
    }
}

async function replyToLine(token: string, text: string) {
    if (!CHANNEL_ACCESS_TOKEN) return;
    await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}` },
        body: JSON.stringify({ replyToken: token, messages: [{ type: "text", text: text }] })
    });
}
