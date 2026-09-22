// api/send-order-alert.js

export default async function handler(req, res) {
  // Allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const order = req.body;
  if (!order || !order.orderId) {
    return res.status(400).json({ error: "Missing order payload" });
  }

  // 1. Read Environment Variables
  const greenApiUrl = (
    process.env.GREEN_API_URL || "https://7107.api.greenapi.com"
  ).replace(/\/$/, "");
  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const tokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;
  const fatherPhone = process.env.FATHER_PHONE || "9872633001";
  const yourPhone = process.env.YOUR_PHONE || "9988604013";

  if (!idInstance || !tokenInstance) {
    console.error("Green-API credentials missing in environment variables.");
    return res
      .status(500)
      .json({ error: "Green-API credentials not configured in Vercel" });
  }

  // 2. Format phone number to Green-API ChatId (e.g. 919872633001@c.us)
  const formatChatId = (phone) => {
    if (!phone) return null;
    let clean = phone.toString().replace(/\D/g, "");
    if (clean.length === 10) clean = "91" + clean;
    return `${clean}@c.us`;
  };

  const recipientChatIds = [
    formatChatId(fatherPhone),
    formatChatId(yourPhone),
  ].filter(Boolean);

  // 3. Construct WhatsApp Message
  const itemsText = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name || item.title}* (x${item.quantity || 1}) - ₹${(Number(item.price) || 0) * (item.quantity || 1)}`,
    )
    .join("\n");

  const customerPhoneClean = (order.customerPhone || "").replace(/\D/g, "");

  const whatsappMessage = `🚨 *NEW ORDER RECEIVED - GETWELL MEDICOS* 🚨
━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderId}
💰 *Total Bill:* ₹${order.totalAmount}
💳 *Payment:* ${order.paymentMethod} (${order.paymentStatus})

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* +91 ${order.customerPhone}
• *Address:* ${order.address}, ${order.city} - ${order.pincode}
• *Zone:* ${order.isLocal ? "⚡ Tricity 1-2 Hr Express" : "🚚 Pan-India Courier"}

📋 *ITEMS TO PACK:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💬 *1-Tap Customer WhatsApp:*
https://wa.me/91${customerPhoneClean}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20Getwell%20Medicos%20Sec%2035C.%20Your%20Order%20%23${order.orderId}%20is%20being%20packed.`;

  // 4. Send message to both recipients in parallel via Green-API
  const sendEndpoint = `${greenApiUrl}/waInstance${idInstance}/sendMessage/${tokenInstance}`;

  try {
    const sendPromises = recipientChatIds.map(async (chatId) => {
      const response = await fetch(sendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chatId,
          message: whatsappMessage,
        }),
      });
      return response.json();
    });

    const results = await Promise.all(sendPromises);
    console.log("Green-API dispatch results:", results);

    return res.status(200).json({
      success: true,
      recipients: recipientChatIds.length,
      results,
    });
  } catch (error) {
    console.error("Failed to send Green-API message:", error);
    return res.status(500).json({ error: error.message });
  }
}
