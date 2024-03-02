import { UpdateDealDto } from './dto/updateDeal.dto';
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { CreateDealDto } from './dto/createDeal.dto';
import { NotImplementedError } from '../errors';
import { DealDtoResponse } from './dto/dealResponse.dto';
import { ListDealDtoResponse } from './dto/listDeals.dto';
import { UploadDocumentDTO } from './dto/uploadDocument.dto';
import { UploadDocumentResponseDTO } from './dto/uploadDocumentResponse.dto';
import { WhitelistWalletDto } from './dto/whitelistWallet.dto';
import { WalletResponseDTO } from './dto/walletResponse.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
    @Get()
    @ApiOperation({ summary: 'Get all deals' })
    @ApiResponse({ status: 200, type:[ListDealDtoResponse], description: 'Returns all deals' })
    findAll(): CreateDealDto[] {
        throw new NotImplementedError()
    }

    @Post()
    @ApiOperation({ summary: 'Create a deal' })
    @ApiResponse({ status: 201, type: DealDtoResponse, description: 'The deal has been successfully created' })
    create(@Body() dealDto: CreateDealDto): DealDtoResponse {
        throw new NotImplementedError()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a deal' })
    @ApiResponse({ status: 200, type:DealDtoResponse, description: 'Returns deal with id' })
    findOne(@Param('id') id: number): DealDtoResponse {
        throw new NotImplementedError()
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a deal' })
    @ApiResponse({ status: 200, type:DealDtoResponse, description: 'The deal has been successfully updated' })
    update(@Param('id') id: number, @Body() dealDto: UpdateDealDto): DealDtoResponse {
        throw new NotImplementedError()
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a deal' })
    @ApiResponse({ status: 200, description: 'The deal has been successfully deleted' })
    delete(@Param('id') id: number): void {
        throw new NotImplementedError()
    }

    @Post(':id/docs')
    @ApiOperation({ summary: 'Upload document to a deal milestone' })
    @ApiResponse({ status: 200, type:UploadDocumentResponseDTO, description: 'The deal document was successfully uploaded' })
    @ApiConsumes('multipart/form-data')
    uploadDealDocument(@Param('id') id: number,@Body() payload:UploadDocumentDTO): UploadDocumentResponseDTO {
        throw new NotImplementedError()
    }

    @Delete(':id/docs/:docId')
    @ApiOperation({ summary: 'Delete deal document' })
    @ApiResponse({ status: 200, description: 'The deal document was successfully deleted' })
    deleteDealDocument(@Param('id') id: number,@Param('docId') docId: number): void {
        throw new NotImplementedError()
    }

    @Post(':id/whitelist')
    @ApiOperation({ summary: 'Whitelist wallet' })
    @ApiResponse({ status: 200,type:WalletResponseDTO, description: 'The wallet was successfully whitelisted' })
    whitelistAddress(@Param('id') id: number,@Body() payload:WhitelistWalletDto): void {
        throw new NotImplementedError()
    }

    @Delete(':id/whitelist/:walletId')
    @ApiOperation({ summary: 'Remove wallet from whitelist' })
    @ApiResponse({ status: 200, description: 'The wallet was successfully deleted from whitelist' })
    blacklistAddress(@Param('id') id: number,@Param('walletId') walletId: number): void {
        throw new NotImplementedError()
    }

    @Post(':id/milestones/:milestoneId/docs')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload document to a deal milestone' })
    @ApiResponse({ status: 200,type:UploadDocumentResponseDTO, description: 'The deal milestone document was successfully uploaded' })
    uploadMilestoneDocument(@Param('id') id: number,@Param('milestoneId') milestoneId: number,@Body() payload:UploadDocumentDTO): UploadDocumentResponseDTO {
        throw new NotImplementedError()
    }

    @Delete(':id/milestones/:milestoneId/docs/:docId')
    @ApiOperation({ summary: 'Delete a milestone document' })
    @ApiResponse({ status: 200, description: 'The deal milestone document was successfully deleted' })
    deleteMilestoneDocument(@Param('id') id: number,@Param('milestoneId') milestoneId: number,@Param('docId') docId: number): void {
        throw new NotImplementedError()
    }
}
