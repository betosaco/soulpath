-- Add comprehensive order confirmation template
INSERT INTO communication_templates (template_key, name, description, type, category, is_active, is_default)
VALUES ('order_confirmation_matpass', 'Order Confirmation - MATPASS & Products', 'Comprehensive order confirmation for MATPASS purchases with bookings and products', 'email', 'transaction', true, false)
ON CONFLICT (template_key) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description,
updated_at = NOW();

-- Get the template ID
WITH template_data AS (
  SELECT id FROM communication_templates WHERE template_key = 'order_confirmation_matpass'
)
-- Add English translation
INSERT INTO communication_template_translations (template_id, language, subject, content)
SELECT 
  (SELECT id FROM template_data),
  'en',
  'Your MATMAX Order Confirmation',
  '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>MATMAX - Order Confirmation</title></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,''Helvetica Neue'',Arial,sans-serif;background-color:#f5f5f0;color:#333"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f5f0"><tr><td style="padding:40px 20px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin:0 auto;background-color:#fff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);max-width:100%"><tr><td style="background:linear-gradient(135deg,#2d5016 0%,#4a7c2e 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0"><h1 style="margin:0;color:#fff;font-size:32px;font-weight:300;letter-spacing:3px">MATMAX</h1><p style="margin:8px 0 0 0;color:#e8f5e9;font-size:14px;letter-spacing:1px">WELLNESS STUDIO</p></td></tr><tr><td style="padding:40px 30px 20px 30px"><h2 style="margin:0 0 10px 0;color:#2d5016;font-size:24px;font-weight:600">Hello {{userName}},</h2><p style="margin:0;color:#666;font-size:16px;line-height:1.6">Thank you for your purchase at MATMAX Wellness Studio. Order total: <strong>S/ {{orderTotal}}</strong></p></td></tr><tr><td style="padding:0 30px 30px 30px;text-align:center"><a href="mailto:{{adminEmail}}" style="display:inline-block;background-color:#4a7c2e;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-weight:600;font-size:14px">Contact Support</a></td></tr><tr><td style="background-color:#f5f5f0;padding:30px;text-align:center;border-radius:0 0 12px 12px"><p style="margin:0 0 10px 0;color:#2d5016;font-size:16px;font-weight:600;letter-spacing:2px">MATMAX WELLNESS STUDIO</p><p style="margin:0;color:#666;font-size:13px">📧 {{adminEmail}} | 🌐 matmax.world</p></td></tr></table></td></tr></table></body></html>'
ON CONFLICT (template_id, language) DO UPDATE SET
subject = EXCLUDED.subject,
content = EXCLUDED.content,
updated_at = NOW();

-- Add Spanish translation
WITH template_data AS (
  SELECT id FROM communication_templates WHERE template_key = 'order_confirmation_matpass'
)
INSERT INTO communication_template_translations (template_id, language, subject, content)
SELECT 
  (SELECT id FROM template_data),
  'es',
  'Confirmación de tu Pedido MATMAX',
  '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>MATMAX - Confirmación de Pedido</title></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,''Helvetica Neue'',Arial,sans-serif;background-color:#f5f5f0;color:#333"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f5f0"><tr><td style="padding:40px 20px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin:0 auto;background-color:#fff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);max-width:100%"><tr><td style="background:linear-gradient(135deg,#2d5016 0%,#4a7c2e 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0"><h1 style="margin:0;color:#fff;font-size:32px;font-weight:300;letter-spacing:3px">MATMAX</h1><p style="margin:8px 0 0 0;color:#e8f5e9;font-size:14px;letter-spacing:1px">WELLNESS STUDIO</p></td></tr><tr><td style="padding:40px 30px 20px 30px"><h2 style="margin:0 0 10px 0;color:#2d5016;font-size:24px;font-weight:600">Hola {{userName}},</h2><p style="margin:0;color:#666;font-size:16px;line-height:1.6">Gracias por tu compra en MATMAX Wellness Studio. Total del pedido: <strong>S/ {{orderTotal}}</strong></p></td></tr><tr><td style="padding:0 30px 30px 30px;text-align:center"><a href="mailto:{{adminEmail}}" style="display:inline-block;background-color:#4a7c2e;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-weight:600;font-size:14px">Contactar Soporte</a></td></tr><tr><td style="background-color:#f5f5f0;padding:30px;text-align:center;border-radius:0 0 12px 12px"><p style="margin:0 0 10px 0;color:#2d5016;font-size:16px;font-weight:600;letter-spacing:2px">MATMAX WELLNESS STUDIO</p><p style="margin:0;color:#666;font-size:13px">📧 {{adminEmail}} | 🌐 matmax.world</p></td></tr></table></td></tr></table></body></html>'
ON CONFLICT (template_id, language) DO UPDATE SET
subject = EXCLUDED.subject,
content = EXCLUDED.content,
updated_at = NOW();
