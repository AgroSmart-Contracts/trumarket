import { ActorSubclass } from '@dfinity/agent';
import * as crypto from 'crypto';

import { Deal, Milestone } from '@/deals/deals.entities';
import { logger } from '@/logger';

import { createActor } from './trumarket-icp-app-backend';
import { _SERVICE } from './trumarket-icp-app-backend/trumarket-icp-app-backend.did';

// TODO: integrate safer way to access canister
// const privateKey = process.env.ICP_PK;
const canisterId = process.env.ICP_CANISTER_ID;
const icpRpcProvider = process.env.ICP_RPC_PROVIDER;

class FinanceAppClient {
  canister: ActorSubclass<_SERVICE>;

  constructor() {
    if (!canisterId || !icpRpcProvider) {
      logger.warn('Missing ICP configuration');
      return;
    }

    this.canister = createActor(canisterId, {
      agentOptions: {
        host: icpRpcProvider,
      },
    });
  }

  _createSignature() {
    return '202a9e30f303a8ec8ed0a7d2143100728dae672e3cbcaf12eb7d484329f3e1b026751f93cded7b1a0540fb07d47b50e042f9ff443d9123d4a6a64156a585ef6782704240a9f5124c0682d231c7c12287b22cd96de9ca5f97e968ebb01f2505b8e6d0c617a8b30c65ab457f0ee4f2bed26aa4a0adbf4bf769a30b51291a274ae424f488a726528f9d45f38223db67dd12213ad0d34b96416edb22f676d099f9310b05f24540bb35c7b799d3fc03e3706fa6ed777d0e152c4bb97d5e8f6ca3fa6b37e4d959413e4de5a3330dbef508a44b5bd0371b0cf4114ebd83d0093937625062fcc14fe220a754eb4d6cb5d4063214068048b6c0177e958ad1dc76ca9ee54e';
    const sign = crypto.createSign('SHA256');
    sign.update('This is a secret message');
    sign.end();

    const signature = sign.sign(privateKey, 'hex');

    return signature;
  }

  async publishShipment(shipment: Deal) {
    const signature = this._createSignature();

    await this.canister.createShipment(
      {
        id: shipment.id,
        name: shipment.name,
        status: shipment.status,
        origin: shipment.origin,
        destination: shipment.destination,
        presentation: shipment.presentation,
        variety: shipment.variety,
        docs: shipment.docs.map((doc) => ({
          description: doc.description,
          _id: doc.id,
          url: doc.url,
        })),
        portOfDestination: shipment.portOfDestination,
        portOfOrigin: shipment.portOfOrigin,
        shippingStartDate: shipment.shippingStartDate.toISOString(),
        expectedShippingEndDate: shipment.expectedShippingEndDate.toISOString(),
        currentMilestone: shipment.currentMilestone,
        milestones: shipment.milestones.map((milestone) => ({
          docs: milestone.docs.map((doc) => ({
            description: doc.description,
            _id: doc.id,
            url: doc.url,
          })),
          id: milestone.id,
          fundsDistribution: milestone.fundsDistribution,
        })),
        quality: shipment.quality,
        offerUnitPrice: shipment.offerUnitPrice,
        quantity: shipment.quantity,
        transport: shipment.transport,
        description: shipment.description || '',
        investmentAmount: shipment.investmentAmount || 0,
        nftID: shipment.nftID || 0,
        mintTxHash: shipment.mintTxHash || '',
        vaultAddress: shipment.vaultAddress ? [shipment.vaultAddress] : [],
      },
      signature,
    );
  }

  async updateMilestone(id: string, milestone: Milestone) {
    const signature = this._createSignature();

    await this.canister.updateMilestone(
      id,
      {
        id: milestone.id,
        docs: milestone.docs
          .filter((doc) => doc.publiclyVisible)
          .map((doc) => ({
            description: doc.description,
            _id: doc.id,
            url: doc.url,
          })),
        fundsDistribution: milestone.fundsDistribution,
      },
      signature,
    );
  }

  async createActivity(
    shipmentId: string,
    activityType: string,
    description: string,
    txHash: string,
    timestamp: Date,
  ) {
    const signature = this._createSignature();

    await this.canister.createShipmentActivity(
      shipmentId,
      {
        activityType,
        description,
        createdAt: timestamp.toISOString(),
        txHash,
      },
      signature,
    );
  }
}

export default new FinanceAppClient();
