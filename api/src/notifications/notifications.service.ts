import { Injectable } from '@nestjs/common';

import { Deal } from '@/deals/deals.entities';
import { logger } from '@/logger';

@Injectable()
export class NotificationsService {
  async _sendNotification(recipient: string, message: string) {
    logger.debug(`Sending notification to ${recipient}: ${message}`);
  }

  async sendInviteToSignupNotification(recipient: string): Promise<void> {
    await this._sendNotification(recipient, 'Invite to signup notification');
  }

  async sendNewProposalNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `New proposal notification ${deal}`,
    );
  }

  async sendChangesInProposalNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `Changes in proposal notification ${deal}`,
    );
  }

  async sendNewDocumentUploadedNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `New document uploaded notification ${deal}`,
    );
  }

  async sendNewMilestoneDocumentUploadedNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `New document uploaded notification ${deal}`,
    );
  }

  async sendDealConfirmedNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `Deal confirmed notification ${deal}`,
    );
  }

  async sendMilestoneClosedNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `Milestone closed notification ${deal}`,
    );
  }

  async sendDealCompletedNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `Deal completed notification ${deal}`,
    );
  }

  async sendProposalCancelledNotification(
    recipient: string,
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(
      recipient,
      `Proposal cancelled notification ${deal}`,
    );
  }
}
