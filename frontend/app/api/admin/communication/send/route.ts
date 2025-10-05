import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { CommunicationService } from '@/lib/services/communication-service';
import { RecipientService } from '@/lib/services/recipient-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const {
      channel,
      recipients,
      content,
      subject,
      templateId
    } = await request.json();

    if (!channel || !recipients || !content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        message: 'Channel, recipients, and content are required'
      }, { status: 400 });
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid recipients',
        message: 'Recipients must be a non-empty array'
      }, { status: 400 });
    }

    // Initialize services
    const communicationService = new CommunicationService();
    const recipientService = new RecipientService();

    // Get recipient details
    const recipientDetails = await recipientService.getRecipientsByIds(recipients);

    if (recipientDetails.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid recipients found',
        message: 'None of the specified recipients could be found'
      }, { status: 400 });
    }

    // Send messages based on channel
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    try {
      switch (channel) {
        case 'email':
          if (!subject) {
            return NextResponse.json({
              success: false,
              error: 'Subject required for email',
              message: 'Email subject is required'
            }, { status: 400 });
          }

          for (const recipient of recipientDetails) {
            if (recipient.email) {
              try {
                await communicationService.sendEmail({
                  to: recipient.email,
                  subject,
                  html: content,
                  templateId: templateId || undefined
                });
                results.push({ recipient: recipient.email, success: true });
                successCount++;
              } catch (error) {
                results.push({
                  recipient: recipient.email,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
                failureCount++;
              }
            }
          }
          break;

        case 'sms':
          for (const recipient of recipientDetails) {
            if (recipient.phone) {
              try {
                await communicationService.sendSMS({
                  to: recipient.phone,
                  message: content,
                  templateId: templateId || undefined
                });
                results.push({ recipient: recipient.phone, success: true });
                successCount++;
              } catch (error) {
                results.push({
                  recipient: recipient.phone,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
                failureCount++;
              }
            }
          }
          break;

        case 'telegram':
          for (const recipient of recipientDetails) {
            if (recipient.telegramId) {
              try {
                await communicationService.sendTelegramMessage({
                  chatId: recipient.telegramId,
                  message: content,
                  templateId: templateId || undefined
                });
                results.push({ recipient: recipient.telegramId, success: true });
                successCount++;
              } catch (error) {
                results.push({
                  recipient: recipient.telegramId,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
                failureCount++;
              }
            }
          }
          break;

        case 'whatsapp':
          for (const recipient of recipientDetails) {
            if (recipient.whatsappId) {
              try {
                await communicationService.sendWhatsAppMessage({
                  to: recipient.whatsappId,
                  message: content,
                  templateId: templateId || undefined
                });
                results.push({ recipient: recipient.whatsappId, success: true });
                successCount++;
              } catch (error) {
                results.push({
                  recipient: recipient.whatsappId,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
                failureCount++;
              }
            }
          }
          break;

        case 'instagram':
          for (const recipient of recipientDetails) {
            if (recipient.instagramId) {
              try {
                await communicationService.sendInstagramMessage({
                  to: recipient.instagramId,
                  message: content,
                  templateId: templateId || undefined
                });
                results.push({ recipient: recipient.instagramId, success: true });
                successCount++;
              } catch (error) {
                results.push({
                  recipient: recipient.instagramId,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
                });
                failureCount++;
              }
            }
          }
          break;

        default:
          return NextResponse.json({
            success: false,
            error: 'Unsupported channel',
            message: `Channel '${channel}' is not supported`
          }, { status: 400 });
      }

      // Log the communication attempt
      await prisma.communicationLog.create({
        data: {
          type: channel,
          recipients: results.map(r => r.recipient),
          content,
          subject: channel === 'email' ? subject : null,
          templateId: templateId || null,
          status: failureCount === 0 ? 'sent' : 'partial',
          sentBy: user.id,
          metadata: {
            results,
            successCount,
            failureCount
          }
        }
      });

      return NextResponse.json({
        success: true,
        message: `Message sent to ${successCount} recipient(s)${failureCount > 0 ? ` (${failureCount} failed)` : ''}`,
        results: {
          total: recipients.length,
          success: successCount,
          failed: failureCount,
          details: results
        }
      });

    } catch (error) {
      console.error('Error sending messages:', error);

      // Log the failed attempt
      await prisma.communicationLog.create({
        data: {
          type: channel,
          recipients: recipients,
          content,
          subject: channel === 'email' ? subject : null,
          templateId: templateId || null,
          status: 'failed',
          sentBy: user.id,
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            recipients
          }
        }
      });

      return NextResponse.json({
        success: false,
        error: 'Failed to send messages',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in send endpoint:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
