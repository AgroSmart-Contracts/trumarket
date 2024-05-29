import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { Deal, Milestone } from '@/deals/deals.entities';
import { logger } from '@/logger';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async _sendNotification(
    recipients: string[],
    subject: string,
    message: string,
  ) {
    try {
      this.mailerService.sendMail({
        to: recipients,
        subject,
        text: message,
      });
    } catch (e) {
      logger.error(e, 'Error sending email', e);
    }
  }

  async sendInviteToSignupNotification(recipients: string[]): Promise<void> {
    await this._sendNotification(
      recipients,
      'Signup Invitation',
      'Invite to signup notification',
    );
  }

  async sendNewProposalNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'New Proposal',
      `New proposal notification ${JSON.stringify(deal)}`,
    );
  }

  async sendChangesInProposalNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Changes in Proposal',
      `Changes in proposal notification ${JSON.stringify(deal)}`,
    );
  }

  async sendNewDocumentUploadedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Document Uploaded',
      `New document uploaded notification ${JSON.stringify(deal)}`,
    );
  }

  async sendNewMilestoneDocumentUploadedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Milestone Document Uploaded',
      `New document uploaded notification ${JSON.stringify(deal)}`,
    );
  }

  async sendMilestoneApprovedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Milestone Approved',
      `Milestone approved notification ${JSON.stringify(deal)} ${JSON.stringify(milestone)}`,
    );
  }

  async sendDealConfirmedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Deal Confirmed',
      `Deal confirmed notification ${JSON.stringify(deal)}`,
    );
  }

  async sendDealCompletedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Deal completed',
      `Deal completed notification ${JSON.stringify(deal)}`,
    );
  }

  async sendProposalCancelledNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      'Deal cancelled',
      `Proposal cancelled notification ${JSON.stringify(deal)}`,
    );
  }
}
