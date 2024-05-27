import { Injectable } from '@nestjs/common';

import { Deal, Milestone } from '@/deals/deals.entities';
import { logger } from '@/logger';

@Injectable()
export class NotificationsService {
  async _sendNotification(recipients: string[], message: string) {
    logger.debug(`Sending notification to ${recipients}: ${message}`);
  }

  async sendInviteToSignupNotification(recipients: string[]): Promise<void> {
    await this._sendNotification(recipients, 'Invite to signup notification');
  }

  async sendNewProposalNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `New proposal notification ${deal}`,
    );
  }

  async sendChangesInProposalNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Changes in proposal notification ${deal}`,
    );
  }

  async sendNewDocumentUploadedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `New document uploaded notification ${deal}`,
    );
  }

  async sendNewMilestoneDocumentUploadedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `New document uploaded notification ${deal} `,
    );
  }

  async sendMilestoneApprovedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Milestone approved notification ${deal} ${milestone}`,
    );
  }

  async sendDealConfirmedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Deal confirmed notification ${deal}`,
    );
  }

  async sendMilestoneClosedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Milestone closed notification ${deal}`,
    );
  }

  async sendDealCompletedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Deal completed notification ${deal}`,
    );
  }

  async sendProposalCancelledNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipients,
      `Proposal cancelled notification ${deal}`,
    );
  }
}
