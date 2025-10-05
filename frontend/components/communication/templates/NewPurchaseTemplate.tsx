export const NEW_PURCHASE_TEMPLATE = `🌿 **MATMAX WELLNESS STUDIO**
_Premium Yoga Classes in Miraflores, Lima_

━━━━━━━━━━━━━━━━━━━━━━

✨ **Hello {{userName}}!**

Thank you for your purchase at MATMAX Wellness Studio. Here's a summary of your order:

━━━━━━━━━━━━━━━━━━━━━━

📧 **ORDER CONFIRMATION**
Email: {{userEmail}}
Date: {{submissionDate}}

━━━━━━━━━━━━━━━━━━━━━━

{{#if hasMatpass}}
🎫 **MATPASS PURCHASE**

**{{matpassType}}**
{{matpassDescription}}

💰 **Price:** S/ {{matpassPrice}}

📅 **Validity:**
From: {{matpassStartDate}}
Until: {{matpassEndDate}}

━━━━━━━━━━━━━━━━━━━━━━
{{/if}}

{{#if hasBooking}}
📅 **SESSION BOOKING**
Booking ID: \`{{bookingId}}\`

📍 **Session Information:**
• Date: {{bookingDate}}
• Time: {{bookingTime}}
• Teacher: {{teacherName}}
• Class: {{className}}
• Venue: {{venue}}

━━━━━━━━━━━━━━━━━━━━━━
{{/if}}

{{#if hasProducts}}
🛍️ **PRODUCTS ORDERED**

{{#each products}}
**{{productName}}**
{{productDescription}}
Qty: {{productQuantity}} | S/ {{productPrice}}

{{/each}}
**Products Subtotal:** S/ {{productsSubtotal}}

━━━━━━━━━━━━━━━━━━━━━━
{{/if}}

💰 **ORDER SUMMARY**

MATPASS: S/ {{matpassSubtotal}}
Products: S/ {{productsSubtotal}}
─────────────────
Subtotal: S/ {{subtotalBeforeTax}}
IGV (18%): S/ {{igvAmount}}
─────────────────
**TOTAL PAID: S/ {{orderTotal}}**

━━━━━━━━━━━━━━━━━━━━━━

⚠️ **IMPORTANT REMINDERS**

• Arrive 10 minutes early for in-person sessions
• Bring comfortable clothing and your yoga mat
• Cancellations must be made 24 hours in advance
• Stay hydrated before and after your session

━━━━━━━━━━━━━━━━━━━━━━

❓ **Need Help?**
Contact us: {{adminEmail}}
Website: matmax.world

🙏 _Thank you for choosing MATMAX Wellness Studio!_

━━━━━━━━━━━━━━━━━━━━━━
© 2025 MATMAX Wellness Studio. All rights reserved.`;

export const NEW_PURCHASE_VARIABLES = {
  user: [
    'userName',
    'userEmail', 
    'user_phone',
    'submissionDate'
  ],
  matpass: [
    'matpassType',
    'matpassDescription',
    'matpassPrice',
    'matpassStartDate',
    'matpassEndDate',
    'matpassSubtotal'
  ],
  booking: [
    'bookingId',
    'bookingDate',
    'bookingTime',
    'teacherName',
    'className',
    'venue'
  ],
  products: [
    'productName',
    'productDescription',
    'productQuantity',
    'productPrice',
    'productsSubtotal'
  ],
  order: [
    'subtotalBeforeTax',
    'igvAmount',
    'orderTotal'
  ],
  system: [
    'adminEmail',
    'date',
    'time',
    'studio_name'
  ]
};

export const NEW_PURCHASE_CONDITIONALS = [
  'hasMatpass',
  'hasBooking', 
  'hasProducts'
];

export const NEW_PURCHASE_LOOPS = [
  'products'
];

