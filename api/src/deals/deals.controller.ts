import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BlockchainService } from '../blockchain/blockchain.service';
import { AdminAccessRestricted } from '../decorators/adminRestricted';
// import { WhitelistAccessRestricted } from '../decorators/whitelistRestricted';
import { NotFoundError } from '../errors';
import fileInterceptor from '../file.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { filePipeValidator } from '../multer.options';
import { User } from '../users/users.model';
import { Deal } from './deals.entities';
import { DealsService } from './deals.service';
import { AssignNFTDto } from './dto/assignNFTID.dto';
import { CreateDealDto } from './dto/createDeal.dto';
import { DealLogsDtoResponse } from './dto/dealLogsResponse.dto';
import { DealDtoResponse } from './dto/dealResponse.dto';
import { ListDealsDto } from './dto/listDeals.dto';
import { ListDealDtoResponse } from './dto/listDealsResponse.dto';
import { UpdateDealDto } from './dto/updateDeal.dto';
import { UploadDocumentDTO } from './dto/uploadDocument.dto';
import { UploadDocumentResponseDTO } from './dto/uploadDocumentResponse.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(
    private readonly dealsService: DealsService,
    private readonly blockchainService: BlockchainService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all deals' })
  @ApiResponse({
    status: 200,
    type: [ListDealDtoResponse],
    description: 'Returns all deals',
  })
  async findAll(
    @Request() req,
    @Query() query: ListDealsDto,
  ): Promise<ListDealDtoResponse[]> {
    const user: User = req.user;

    const deals = await this.dealsService.findDealsByUser(user.id, query);

    return deals.map((deal) => new ListDealDtoResponse(deal));
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a deal' })
  @ApiResponse({
    status: 201,
    type: DealDtoResponse,
    description: 'The deal has been successfully created',
  })
  async create(
    @Body() dealDto: CreateDealDto,
    @Request() req,
  ): Promise<DealDtoResponse> {
    const user: User = req.user;

    const deal = await this.dealsService.createDeal(user, dealDto);

    return new DealDtoResponse(deal);
  }

  @Get(':dealId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a deal' })
  @ApiResponse({
    status: 200,
    type: DealDtoResponse,
    description: 'Returns deal with id',
  })
  async findOne(
    @Param('dealId') id: string,
    @Request() req,
  ): Promise<DealDtoResponse> {
    const user: User = req.user;
    const deal = await this.dealsService.findById(id);
    if (!deal) {
      throw new NotFoundError();
    }

    await this.dealsService.checkDealAccess(deal, user);

    const dealDto = new DealDtoResponse(deal);

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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a deal' })
  @ApiResponse({
    status: 200,
    type: DealDtoResponse,
    description: 'The deal has been successfully updated',
  })
  async update(
    @Param('dealId') id: string,
    @Body() dealDto: UpdateDealDto,
    @Request() req,
  ): Promise<DealDtoResponse> {
    const user: User = req.user;

    const { confirm, cancel, currentMilestone, signature, ...restDealDto } =
      dealDto;

    let deal: Deal;

    if (confirm) {
      deal = await this.dealsService.confirmDeal(id, user);
    } else if (cancel) {
      deal = await this.dealsService.cancelDeal(id, user);
    } else if (currentMilestone) {
      deal = await this.dealsService.updateCurrentMilestone(
        id,
        currentMilestone,
        signature,
        user,
      );
    } else {
      deal = await this.dealsService.updateDeal(id, restDealDto, user);
    }

    return new DealDtoResponse(deal);
  }

  @Delete(':dealId')
  @AdminAccessRestricted()
  @ApiOperation({ summary: 'Delete a deal' })
  @ApiResponse({
    status: 200,
    description: 'The deal has been successfully deleted',
  })
  async delete(@Param('dealId') id: string): Promise<void> {
    this.dealsService.deleteDeal(id);
  }

  @Put(':dealId/cover-image')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload deal cover image' })
  @ApiResponse({
    status: 200,
    type: DealDtoResponse,
    description: 'The deal cover image was successfully uploaded',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(fileInterceptor)
  async uploadDealCoverImage(
    @Param('dealId') id: string,
    @UploadedFile(filePipeValidator) file: Express.Multer.File,
    @Request() req,
  ): Promise<DealDtoResponse> {
    const user: User = req.user;

    console.log('uploading deal cover image');
    const deal = await this.dealsService.uploadDealCoverImage(id, file, user);

    return new DealDtoResponse(deal);
  }

  @Post(':dealId/docs')
  @UseGuards(AuthGuard)
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
    @Request() req,
  ): Promise<UploadDocumentResponseDTO> {
    const user: User = req.user;

    const doc = await this.dealsService.uploadDealDocument(
      id,
      file,
      payload.description,
      user,
    );

    return new UploadDocumentResponseDTO(doc);
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
    @Request() req,
  ): Promise<void> {
    const user: User = req.user;
    await this.dealsService.removeDocumentFromDeal(id, docId, user);
  }

  // @Post(':dealId/whitelist')
  // @AdminAccessRestricted()
  // @ApiOperation({ summary: 'Whitelist wallet' })
  // @ApiResponse({
  //   status: 200,
  //   type: WalletResponseDTO,
  //   description: 'The wallet was successfully whitelisted',
  // })
  // async whitelistAddress(
  //   @Param('dealId') id: string,
  //   @Body() payload: WhitelistWalletDto,
  // ): Promise<WalletResponseDTO> {
  //   const deal = await DealModel.findOneAndUpdate(
  //     { _id: id, 'whitelist.address': { $ne: payload.address.toLowerCase() } },
  //     {
  //       $push: { whitelist: payload },
  //     },
  //     { new: true },
  //   );

  //   if (!deal) {
  //     throw new ConflictError();
  //   }

  //   const whitelist = deal.whitelist;

  //   if (!whitelist.length) {
  //     throw new InternalServerError('failed pusing wallet');
  //   }

  //   const wallet = whitelist.pop();
  //   return new WalletResponseDTO(wallet.toJSON());
  // }

  // @Delete(':dealId/whitelist/:walletId')
  // @AdminAccessRestricted()
  // @ApiOperation({ summary: 'Remove wallet from whitelist' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The wallet was successfully deleted from whitelist',
  // })
  // async blacklistAddress(
  //   @Param('dealId') id: string,
  //   @Param('walletId') walletId: string,
  // ): Promise<void> {
  //   await DealModel.findByIdAndUpdate(id, {
  //     $pull: { whitelist: { _id: walletId } },
  //   });
  // }

  @Post(':dealId/milestones/:milestoneId/docs')
  @UseGuards(AuthGuard)
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
    @Request() req,
  ): Promise<UploadDocumentResponseDTO> {
    const user: User = req.user;

    const doc = await this.dealsService.uploadDocumentToMilestone(
      id,
      milestoneId,
      file,
      payload.description,
      user,
    );

    return new UploadDocumentResponseDTO(doc);
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
    @Request() req,
  ): Promise<void> {
    const user: User = req.user;
    await this.dealsService.removeDocumentFromMilestone(
      id,
      milestoneId,
      docId,
      user,
    );
  }

  @Get('/nft/:nftId/logs')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get nft logs' })
  @ApiResponse({
    status: 200,
    type: [DealLogsDtoResponse],
    description: 'The nft logs were successfully got',
  })
  async getDealLogs(
    @Param('nftId') id: string,
    @Request() req,
  ): Promise<DealLogsDtoResponse[]> {
    const user: User = req.user;
    const logs = await this.dealsService.findDealsLogs(id, user);
    return logs.map((doc) => new DealLogsDtoResponse(doc));
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
    const nftID = await this.blockchainService.getNftID(dto.txHash);

    await this.dealsService.assignNftIdToDeal(id, nftID, dto.txHash);
  }
}
