export const NEW_PURCHASE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Confirmation - MATMAX</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E24A4A; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .order-section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #E24A4A; }
        .matpass-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .booking-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .product-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .summary-info { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .reminders { background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 MATMAX WELLNESS STUDIO</h1>
            <h2>Purchase Confirmation</h2>
        </div>
        
        <div class="content">
            <div class="order-section">
                <h3>✨ Hello {{userName}}!</h3>
                <p>Thank you for your purchase at MATMAX Wellness Studio. Here's a summary of your order:</p>
                
                <div class="summary-info">
                    <h4>📧 ORDER CONFIRMATION</h4>
                    <p><strong>Email:</strong> {{userEmail}}</p>
                    <p><strong>Date:</strong> {{submissionDate}}</p>
                </div>

                {{#if hasMatpass}}
                <div class="matpass-info">
                    <h4>🎫 MATPASS PURCHASE</h4>
                    <p><strong>{{matpassType}}</strong></p>
                    <p>{{matpassDescription}}</p>
                    <p><strong>Price:</strong> S/ {{matpassPrice}}</p>
                    <p><strong>Validity:</strong></p>
                    <p>From: {{matpassStartDate}}</p>
                    <p>Until: {{matpassEndDate}}</p>
                </div>
                {{/if}}

                {{#if hasBooking}}
                <div class="booking-info">
                    <h4>📅 SESSION BOOKING</h4>
                    <p><strong>Booking ID:</strong> {{bookingId}}</p>
                    <p><strong>Date:</strong> {{bookingDate}}</p>
                    <p><strong>Time:</strong> {{bookingTime}}</p>
                    <p><strong>Teacher:</strong> {{teacherName}}</p>
                    <p><strong>Class:</strong> {{className}}</p>
                    <p><strong>Venue:</strong> {{venue}}</p>
                </div>
                {{/if}}

                {{#if hasProducts}}
                <div class="product-info">
                    <h4>🛍️ PRODUCTS ORDERED</h4>
                    {{#each products}}
                    <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <p><strong>{{productName}}</strong></p>
                        <p>{{productDescription}}</p>
                        <p>Qty: {{productQuantity}} | S/ {{productPrice}}</p>
                    </div>
                    {{/each}}
                    <p><strong>Products Subtotal:</strong> S/ {{productsSubtotal}}</p>
                </div>
                {{/if}}

                <div class="summary-info">
                    <h4>💰 ORDER SUMMARY</h4>
                    <p>MATPASS: S/ {{matpassSubtotal}}</p>
                    <p>Products: S/ {{productsSubtotal}}</p>
                    <hr>
                    <p>Subtotal: S/ {{subtotalBeforeTax}}</p>
                    <p>IGV (18%): S/ {{igvAmount}}</p>
                    <hr>
                    <p><strong>TOTAL PAID: S/ {{orderTotal}}</strong></p>
                </div>

                <div class="reminders">
                    <h4>⚠️ IMPORTANT REMINDERS</h4>
                    <ul>
                        <li>Arrive 10 minutes early for in-person sessions</li>
                        <li>Bring comfortable clothing and your yoga mat</li>
                        <li>Cancellations must be made 24 hours in advance</li>
                        <li>Stay hydrated before and after your session</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>❓ Need Help?</strong></p>
            <p>Contact us: {{adminEmail}}</p>
            <p>Website: matmax.world</p>
            <p>🙏 <em>Thank you for choosing MATMAX Wellness Studio!</em></p>
            <p>© 2025 MATMAX Wellness Studio. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

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

