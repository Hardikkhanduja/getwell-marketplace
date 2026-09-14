// api/send-order-alert.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order } = req.body;

  if (!order) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  const API_URL = process.env.GREEN_API_URL;
  const ID_INSTANCE = process.env.GREEN_API_ID_INSTANCE ;
  const API_TOKEN = process.env.GREEN_API_TOKEN_INSTANCE;
  const FATHER_PHONE =  '919872633001';
  const YOUR_PHONE = '919988604013';

  if (!API_TOKEN) {
    console.warn('GREEN_API_TOKEN_INSTANCE is missing in environment variables.');
    return res.status(200).json({ success: false, message: 'Token missing' });
  }

  const cleanCustomerPhone = order.phone.replace(/[^0-9]/g, '');
  const customerChatLink = `https://wa.me/91${cleanCustomerPhone.slice(-10)}`;

  const itemsList = order.items
    .map((it, idx) => `  ${idx + 1}. *${it.name}* (Qty: ${it.quantity}) — ₹${it.price * it.quantity}`)
    .join('\n');

  const messageBody = 
`🔔 *NEW ORDER RECEIVED — GETWELL MEDICOS*
━━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderNumber}
📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* +91 ${cleanCustomerPhone.slice(-10)}
👉 *Tap to Chat:* ${customerChatLink}

📍 *DELIVERY ADDRESS:*
${order.address}
${order.city} — ${order.pincode}

💳 *PAYMENT & BILLING:*
• *Payment Mode:* ${order.payMethod}
${order.paymentId ? `• *Razorpay ID:* ${order.paymentId}\n` : ''}• *Delivery Fare:* ${order.deliveryFare}
• *TOTAL PAYABLE:* *₹${order.total}*
━━━━━━━━━━━━━━━━━━━━━
📋 *ITEMS ORDERED:*
${itemsList}
━━━━━━━━━━━━━━━━━━━━━
⚡ *ACTION:*
1. Pack items from Sector 35C counter.
2. Tap customer link above to coordinate delivery/bike dispatch!`;

  const greenApiEndpoint = `${API_URL}/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`;

  // Recipients list
  const recipientNumbers = [FATHER_PHONE, YOUR_PHONE].filter(Boolean);

  try {
    const dispatchPromises = recipientNumbers.map((num) => {
      const cleanNum = num.replace(/[^0-9]/g, '');
      const chatId = `${cleanNum}@c.us`;

      return fetch(greenApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chatId,
          message: messageBody,
        }),
      });
    });

    const responses = await Promise.all(dispatchPromises);
    const data = await Promise.all(responses.map((r) => r.json()));

    console.log('Green-API order alert sent successfully:', data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Green-API alert dispatch error:', err);
    return res.status(500).json({ error: 'Failed to send WhatsApp alert' });
  }
}
