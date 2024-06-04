import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/components';

import { config } from '@/config';
import { Deal, Milestone } from '@/deals/deals.entities';
import { logger } from '@/logger';

import { Email, EmailProps } from './email-template';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async _sendNotification(recipients: string[], email: EmailProps) {
    try {
      this.mailerService.sendMail({
        to: recipients,
        subject: email.actionTitle,
        html: render(Email(email)),
      });
    } catch (e) {
      logger.error(e, 'Error sending email', e);
    }
  }

  async sendInviteToSignupNotification(
    recipients: string[],
    deal: Deal,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Agreement assigned to you',
      descriptionText: `${email} assigned you to the '${deal.name}' shipment agreement in the TruMarket platform. Click the button below to create an account and review the agreement.`,
      buttonText: 'Create account',
      buttonHref: config.appDomain,
    });
  }

  async sendAccountCreatedNotification(recipient: string): Promise<void> {
    await this._sendNotification([recipient], {
      agreementId: '',
      actionTitle: 'Account created',
      descriptionText: 'Your account has been successfully created.',
      buttonText: 'Go to TruMarket application',
      buttonHref: config.appDomain,
    });
  }

  async sendNewProposalNotification(
    recipients: string[],
    deal: Deal,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Agreement assigned to you',
      descriptionText: `${email} assigned you to the '${deal.name}' shipment agreement.`,
      buttonText: 'Review the agreement',
      buttonHref: `${config.appDomain}/dashboard/agreement-details/${deal.id}`,
    });
  }

  async sendChangesInProposalNotification(
    recipients: string[],
    deal: Deal,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Changes requested',
      descriptionText: `${email} requested changes in the '${deal.name}' shipment agreement.`,
      buttonText: 'Review the agreement',
      buttonHref: `${config.appDomain}/dashboard/agreement-details/${deal.id}`,
    });
  }

  async sendMilestoneApprovalRequestNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Milestone approval requested',
      descriptionText: `${email} requested your approval of the '${milestone.description}' milestone of the '${deal.name}' shipment.`,
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
      buttonText: 'Go to the milestone',
    });
  }

  async sendNewMilestoneDocumentUploadedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'New document',
      descriptionText: `${email} added new document to '${milestone.description}' milestone of the '${deal.name}' shipment.`,
      buttonText: 'Go to the milestone',
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
    });
  }

  async sendMilestoneDocumentDeletedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Document deleted',
      descriptionText: `${email} deleted a document in the '${milestone.description}' milestone of the '${deal.name}' shipment.`,
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
      buttonText: 'Go to the milestone',
    });
  }

  async sendMilestoneApprovedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Milestone approved',
      descriptionText: `The '${milestone.description}' milestone of the '${deal.name}' shipment has been approved by ${email}.`,
      buttonText: 'Go to the milestone',
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
    });
  }

  async sendMilestoneDeniedNotification(
    recipients: string[],
    deal: Deal,
    milestone: Milestone,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Milestone denied',
      descriptionText: `The '${milestone.description}' milestone of the '${deal.name}' shipment has been denied by ${email}. Contact him directly for the details.`,
      buttonText: 'Go to the milestone',
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
    });
  }

  async sendDealConfirmedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Agreement accepted',
      descriptionText: `All parties accepted the '${deal.name}' shipment agreement. The shipment is ready to get started!`,
      buttonText: 'Go to shipment',
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
    });
  }

  async sendDealCompletedNotification(
    recipients: string[],
    deal: Deal,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Agreement accepted',
      descriptionText: `The '${deal.name}' shipment arrived to the destination. The agreement is completed!`,
      buttonText: 'Go to shipment',
      buttonHref: `${config.appDomain}/dashboard/shipment-details/${deal.id}`,
    });
  }

  async sendProposalCancelledNotification(
    recipients: string[],
    deal: Deal,
    email: string,
  ): Promise<void> {
    await this._sendNotification(recipients, {
      agreementId: deal.id,
      actionTitle: 'Agreement acceptance cancelled',
      descriptionText: `${email} cancelled his acceptance for the '${deal.name}' shipment agreement. Contact him directly for the details.`,
      buttonText: 'Go to agreement',
      buttonHref: `${config.appDomain}/dashboard`,
    });
  }
}
