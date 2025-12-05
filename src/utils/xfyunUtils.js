export const startIseEvaluation = async (textToRead) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://ownback-production.up.railway.app/api"}/get-ise-auth/`);
    const { wsUrl, app_id } = await res.json();

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ Connected to iFlytek ISE");

      const frame = {
        common: { app_id },
        business: {
          category: "read_sentence",
          ent: "cn_vip",
          tte: "utf-8",
          cmd: "ssb",
          text: textToRead,
        },
        data: { status: 0, audio: "" },
      };

      ws.send(JSON.stringify(frame));
    };

    ws.onmessage = (msg) => console.log("📊 Result:", msg.data);
    ws.onerror = (e) => console.error("❌ WebSocket Error:", e);
    ws.onclose = () => console.log("🔒 Connection closed.");
  } catch (err) {
    console.error("❌ Error starting evaluation:", err);
  }
};
