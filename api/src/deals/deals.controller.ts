import { UpdateDealDto } from './dto/updateDeal.dto';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateDealDto } from './dto/createDeal.dto';
import { ConflictError, InternalServerError, NotFoundError } from '../errors';
import { DealDtoResponse } from './dto/dealResponse.dto';
import { ListDealDtoResponse } from './dto/listDealsResponse.dto';
import { UploadDocumentDTO } from './dto/uploadDocument.dto';
import { UploadDocumentResponseDTO } from './dto/uploadDocumentResponse.dto';
import { WhitelistWalletDto } from './dto/whitelistWallet.dto';
import { WalletResponseDTO } from './dto/walletResponse.dto';
import DealModel from './deals.model';
import fileInterceptor from '../file.interceptor';
import { filePipeValidator } from '../multer.options';
import * as fs from 'fs';
import { s3Service } from '../aws/s3.service';
import { AdminAccessRestricted } from '../decorators/adminRestricted';
import { WhitelistAccessRestricted } from '../decorators/whitelistRestricted';
import { createPublicClient, http, parseAbi, parseEventLogs } from 'viem';
import { AssignNFTDto } from './dto/assignNFTID.dto';
import DealsLogs from '../deals-logs/deals-logs.model';
import { DealLogsDtoResponse } from './dto/dealLogsResponse.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  private async uploadFile(
    file: { path: string; originalname: string },
    dealId: string,
  ): Promise<string | undefined> {
    const fileBuffer = fs.readFileSync(file.path);

    const timestamp = Date.now();
    const key = `deals/${dealId}/${timestamp}-${file.originalname}`;

    const uploadedUrl = await s3Service.uploadFile(key, fileBuffer);
    return uploadedUrl;
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  @ApiResponse({
    status: 200,
    type: [ListDealDtoResponse],
    description: 'Returns all deals',
  })
  async findAll(): Promise<ListDealDtoResponse[]> {
    const deals = await DealModel.find();
    return deals.map((doc) => new ListDealDtoResponse(doc.toJSON()));
  }

  @Post()
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Create a deal' })
  @ApiResponse({
    status: 201,
    type: DealDtoResponse,
    description: 'The deal has been successfully created',
  })
  async create(@Body() dealDto: CreateDealDto): Promise<DealDtoResponse> {
    const deal = await DealModel.create(dealDto);
    return new DealDtoResponse(deal.toJSON());
  }

  @Get(':dealId')
  @WhitelistAccessRestricted()
  @ApiOperation({ summary: 'Get a deal' })
  @ApiResponse({
    status: 200,
    type: DealDtoResponse,
    description: 'Returns deal with id',
  })
  async findOne(@Param('dealId') id: string): Promise<DealDtoResponse> {
    const deal = await DealModel.findById(id);
    if (!deal) {
      throw new NotFoundError();
    }

    const dealDto = new DealDtoResponse(deal.toJSON());

    dealDto.milestones = dealDto.milestones.map((m, index) => {
      let status = 'Completed';

      if (dealDto.currentMilestone < index) {
        status = 'Not Completed';
      } else if (dealDto.currentMilestone === index) {
        status = 'In Progress';
      }

      return {
        ...m,
        status,
      };
    });

    return dealDto;
  }

  @Put(':dealId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Update a deal' })
  @ApiResponse({
    status: 200,
    type: DealDtoResponse,
    description: 'The deal has been successfully updated',
  })
  async update(
    @Param('dealId') id: string,
    @Body() dealDto: UpdateDealDto,
  ): Promise<DealDtoResponse> {
    const deal = await DealModel.findByIdAndUpdate(
      id,
      { $set: dealDto },
      { new: true },
    );
    if (!deal) {
      throw new NotFoundError();
    }
    return new DealDtoResponse(deal.toJSON());
  }

  @Delete(':dealId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Delete a deal' })
  @ApiResponse({
    status: 200,
    description: 'The deal has been successfully deleted',
  })
  async delete(@Param('dealId') id: string): Promise<void> {
    await DealModel.findByIdAndDelete(id);
  }

  @Post(':dealId/docs')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Upload document to a deal milestone' })
  @ApiResponse({
    status: 200,
    type: UploadDocumentResponseDTO,
    description: 'The deal document was successfully uploaded',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(fileInterceptor)
  async uploadDealDocument(
    @Param('dealId') id: string,
    @Body() payload: UploadDocumentDTO,
    @UploadedFile(filePipeValidator) file: Express.Multer.File,
  ): Promise<UploadDocumentResponseDTO> {
    const fileUrl = await this.uploadFile(file, id);

    const deal = await DealModel.findByIdAndUpdate(
      id,
      {
        $push: { docs: { url: fileUrl, ...payload } },
      },
      { new: true },
    );

    const docs = deal.docs.pop();

    return new UploadDocumentResponseDTO(docs.toJSON());
  }

  @Delete(':dealId/docs/:docId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Delete deal document' })
  @ApiResponse({
    status: 200,
    description: 'The deal document was successfully deleted',
  })
  async deleteDealDocument(
    @Param('dealId') id: string,
    @Param('docId') docId: string,
  ): Promise<void> {
    await DealModel.findByIdAndUpdate(id, {
      $pull: { docs: { _id: docId } },
    });
  }

  @Post(':dealId/whitelist')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Whitelist wallet' })
  @ApiResponse({
    status: 200,
    type: WalletResponseDTO,
    description: 'The wallet was successfully whitelisted',
  })
  async whitelistAddress(
    @Param('dealId') id: string,
    @Body() payload: WhitelistWalletDto,
  ): Promise<WalletResponseDTO> {
    const deal = await DealModel.findOneAndUpdate(
      { _id: id, 'whitelist.address': { $ne: payload.address.toLowerCase() } },
      {
        $push: { whitelist: payload },
      },
      { new: true },
    );

    if (!deal) {
      throw new ConflictError();
    }

    const whitelist = deal.whitelist;

    if (!whitelist.length) {
      throw new InternalServerError('failed pusing wallet');
    }

    const wallet = whitelist.pop();
    return new WalletResponseDTO(wallet.toJSON());
  }

  @Delete(':dealId/whitelist/:walletId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Remove wallet from whitelist' })
  @ApiResponse({
    status: 200,
    description: 'The wallet was successfully deleted from whitelist',
  })
  async blacklistAddress(
    @Param('dealId') id: string,
    @Param('walletId') walletId: string,
  ): Promise<void> {
    await DealModel.findByIdAndUpdate(id, {
      $pull: { whitelist: { _id: walletId } },
    });
  }

  @Post(':dealId/milestones/:milestoneId/docs')
  @AdminAccessRestricted()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload document to a deal milestone' })
  @ApiResponse({
    status: 200,
    type: UploadDocumentResponseDTO,
    description: 'The deal milestone document was successfully uploaded',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(fileInterceptor)
  async uploadMilestoneDocument(
    @Param('dealId') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() payload: UploadDocumentDTO,
    @UploadedFile(filePipeValidator) file: Express.Multer.File,
  ): Promise<UploadDocumentResponseDTO> {
    const fileUrl = await this.uploadFile(file, id);

    const deal = await DealModel.findOneAndUpdate(
      { _id: id, 'milestones._id': milestoneId },
      {
        $push: { 'milestones.$.docs': { url: fileUrl, ...payload } },
      },
      { new: true },
    );

    const milestone = deal.milestones.find(
      (m) => m.toJSON().id === milestoneId,
    );

    if (!milestone) {
      throw new NotFoundError('milestone not found');
    }

    const docs = milestone.docs.pop();

    return new UploadDocumentResponseDTO(docs.toJSON());
  }

  @Delete(':dealId/milestones/:milestoneId/docs/:docId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Delete a milestone document' })
  @ApiResponse({
    status: 200,
    description: 'The deal milestone document was successfully deleted',
  })
  async deleteMilestoneDocument(
    @Param('dealId') id: string,
    @Param('milestoneId') milestoneId: string,
    @Param('docId') docId: string,
  ): Promise<void> {
    await DealModel.findOneAndUpdate(
      { _id: id, 'milestones._id': milestoneId },
      {
        $pull: { 'milestones.$.docs': { _id: docId } },
      },
    );
  }

  @Get('/nft/:nftId/logs')
  @ApiOperation({ summary: 'Get nft logs' })
  @ApiResponse({
    status: 200,
    type: [DealLogsDtoResponse],
    description: 'The nft logs were successfully got',
  })
  async getDealLogs(
    @Param('nftId') id: string,
  ): Promise<DealLogsDtoResponse[]> {
    const logs = await DealsLogs.find({ dealId: id });
    return logs.map((doc) => new DealLogsDtoResponse(doc.toJSON()));
  }

  @Post(':dealId/nft')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Assign NFT to deal' })
  @ApiResponse({
    status: 200,
    description: 'The NFT was successfully assigned',
  })
  async assignNFT(
    @Param('dealId') id: string,
    @Body() dto: AssignNFTDto,
  ): Promise<void> {
    const provider = await createPublicClient({
      transport: http('http://host.docker.internal:8545/'),
    });

    const receipt = await provider.getTransactionReceipt({
      hash: dto.txHash as `0x${string}`,
    });

    const logs = parseEventLogs({
      abi: parseAbi([`event DealCreated(uint256 dealId)`]),
      eventName: 'DealCreated',
      logs: receipt.logs,
    });

    if (!logs.length) {
      throw new InternalServerError('no deal created event was emitted');
    }

    const nftID = logs[0].args.dealId;

    await DealModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { nftID: Number(nftID), mintTxHash: dto.txHash },
      },
    );
  }
}
