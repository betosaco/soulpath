import { prisma } from '@/lib/prisma';

export interface ResolvedRecipient {
  id?: string;
  email?: string;
  telegramChatId?: string;
  name?: string;
  type: 'email' | 'telegram' | 'sms';
}

export interface RecipientQuery {
  type: 'user' | 'group' | 'custom';
  role?: 'ADMIN' | 'TEACHER' | 'USER';
  groupId?: string;
  customEmails?: string[];
  customPhones?: string[];
}

export class RecipientService {
  /**
   * Resolve recipients based on query parameters
   */
  static async resolveRecipients(query: RecipientQuery, context?: any): Promise<ResolvedRecipient[]> {
    const resolvedRecipients: ResolvedRecipient[] = [];

    switch (query.type) {
      case 'user':
        if (query.role) {
          const users = await this.getUsersByRole(query.role);
          resolvedRecipients.push(...users);
        }
        break;

      case 'group':
        if (query.groupId) {
          const groupRecipients = await this.getGroupRecipients(query.groupId);
          resolvedRecipients.push(...groupRecipients);
        }
        break;

      case 'custom':
        if (query.customEmails) {
          query.customEmails.forEach(email => {
            resolvedRecipients.push({
              email: email.trim(),
              name: email.trim(),
              type: 'email'
            });
          });
        }
        if (query.customPhones) {
          query.customPhones.forEach(phone => {
            resolvedRecipients.push({
              name: phone.trim(),
              type: 'sms'
            });
          });
        }
        break;
    }

    return resolvedRecipients;
  }

  /**
   * Get users by role with their contact information
   */
  private static async getUsersByRole(role: string): Promise<ResolvedRecipient[]> {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: role as any,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          telegramChatId: true
        }
      });

      return users.map(user => ({
        id: user.id,
        email: user.email,
        telegramChatId: user.telegramChatId,
        name: user.fullName || user.email,
        type: 'email' as const
      }));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  }

  /**
   * Get recipients from a recipient group
   */
  private static async getGroupRecipients(groupId: string): Promise<ResolvedRecipient[]> {
    try {
      const group = await prisma.recipientGroup.findUnique({
        where: { id: groupId },
        select: {
          recipientIds: true,
          customEmails: true
        }
      });

      if (!group) return [];

      const recipients: ResolvedRecipient[] = [];

      // Add users from recipientIds
      if (group.recipientIds && group.recipientIds.length > 0) {
        const users = await prisma.user.findMany({
          where: {
            id: { in: group.recipientIds },
            status: 'ACTIVE'
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            telegramChatId: true
          }
        });

        recipients.push(...users.map(user => ({
          id: user.id,
          email: user.email,
          telegramChatId: user.telegramChatId,
          name: user.fullName || user.email,
          type: 'email' as const
        })));
      }

      // Add custom emails
      if (group.customEmails && group.customEmails.length > 0) {
        group.customEmails.forEach(email => {
          recipients.push({
            email: email.trim(),
            name: email.trim(),
            type: 'email'
          });
        });
      }

      return recipients;
    } catch (error) {
      console.error('Error fetching group recipients:', error);
      return [];
    }
  }

  /**
   * Validate recipient data
   */
  static validateRecipient(recipient: ResolvedRecipient): boolean {
    switch (recipient.type) {
      case 'email':
        return !!(recipient.email && recipient.email.includes('@'));
      case 'telegram':
        return !!recipient.telegramChatId;
      case 'sms':
        return !!recipient.name; // Phone number stored in name field
      default:
        return false;
    }
  }

  /**
   * Filter recipients by communication type
   */
  static filterByType(recipients: ResolvedRecipient[], type: 'email' | 'telegram' | 'sms'): ResolvedRecipient[] {
    return recipients.filter(recipient => {
      switch (type) {
        case 'email':
          return !!recipient.email;
        case 'telegram':
          return !!recipient.telegramChatId;
        case 'sms':
          return recipient.type === 'sms';
        default:
          return false;
      }
    });
  }

  /**
   * Remove duplicate recipients
   */
  static deduplicateRecipients(recipients: ResolvedRecipient[]): ResolvedRecipient[] {
    const seen = new Set<string>();
    return recipients.filter(recipient => {
      const key = `${recipient.type}:${recipient.email || recipient.telegramChatId || recipient.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Create a recipient group
   */
  static async createRecipientGroup(
    name: string,
    description: string,
    role: string | null,
    scope: 'public' | 'private',
    recipientIds: string[],
    customEmails: string[],
    createdBy: string
  ) {
    try {
      const group = await prisma.recipientGroup.create({
        data: {
          name,
          description,
          role,
          scope,
          recipientIds,
          customEmails,
          createdBy
        }
      });
      return { success: true, group };
    } catch (error) {
      console.error('Error creating recipient group:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update a recipient group
   */
  static async updateRecipientGroup(
    id: string,
    updates: {
      name?: string;
      description?: string;
      recipientIds?: string[];
      customEmails?: string[];
    }
  ) {
    try {
      const group = await prisma.recipientGroup.update({
        where: { id },
        data: updates
      });
      return { success: true, group };
    } catch (error) {
      console.error('Error updating recipient group:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get all recipient groups for a user
   */
  static async getRecipientGroups(createdBy: string) {
    try {
      const groups = await prisma.recipientGroup.findMany({
        where: {
          createdBy,
          isActive: true
        },
        include: {
          _count: {
            select: {
              recipientIds: true,
              customEmails: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return { success: true, groups };
    } catch (error) {
      console.error('Error fetching recipient groups:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
