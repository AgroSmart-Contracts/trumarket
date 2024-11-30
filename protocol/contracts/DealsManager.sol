// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import {DealVault} from "./DealVault.sol";

contract DealsManager is ERC721, ERC721Burnable, Ownable {
    event DealCreated(uint256 dealId);
    event DealMilestoneChanged(uint256 dealId, uint8 milestone);
    event DealCompleted(uint256 dealId);

    struct Deal {
        uint8 status;
        uint8[7] milestones;
        address vault;
        uint256 maxDeposit;
        address borrower;
    }

    address private underlying; // USDC
    uint256 private _nextTokenId;
    Deal[] private deals;

    constructor(
        address initialOwner,
        address _underlying
    ) ERC721("TruMarketDeals", "TMD") Ownable(initialOwner) {
        underlying = _underlying;
    }

    function mint(
        uint8[7] memory milestones,
        uint256 maxDeposit,
        address borrower
    ) public onlyOwner {
        uint256 tokenId = _nextTokenId++;

        uint256 sum = 0;
        for (uint i = 0; i < milestones.length; i++) {
            sum += milestones[i];
        }

        require(sum == 100, "Milestones distribution should be 100");

        address vault = address(
            new DealVault(underlying, maxDeposit, maxDeposit, address(this))
        );

        Deal memory deal = Deal(0, milestones, vault, maxDeposit, borrower);

        deals.push(deal);

        _safeMint(msg.sender, tokenId);

        emit DealCreated(tokenId);
    }

    function milestones(uint256 tokenId) public view returns (uint8[7] memory) {
        require(tokenId <= _nextTokenId, "Deal not found");

        return deals[tokenId].milestones;
    }

    function status(uint256 tokenId) public view returns (uint8) {
        require(tokenId <= _nextTokenId, "Deal not found");

        return deals[tokenId].status;
    }

    function vault(uint256 tokenId) public view returns (address) {
        require(tokenId <= _nextTokenId, "Deal not found");

        return deals[tokenId].vault;
    }

    function maxDeposit(uint256 tokenId) public view returns (uint256) {
        require(tokenId <= _nextTokenId, "Deal not found");

        return deals[tokenId].maxDeposit;
    }

    function proceed(uint256 tokenId, uint8 milestone) public onlyOwner {
        require(tokenId < _nextTokenId, "Deal not found");
        require(
            deals[tokenId].status + 1 == milestone,
            "wrong milestone to proceed to"
        );
        require(milestone > 0 && milestone < 8, "Invalid milestone");

        if (milestone == 1) {
            uint256 funded = DealVault(deals[tokenId].vault).totalAssets();
            require(
                funded == deals[tokenId].maxDeposit,
                "Vault not funded completely"
            );
            DealVault(deals[tokenId].vault).pause();
            DealVault(deals[tokenId].vault).blockDeposits();
        }

        // transfer % of funds
        if (deals[tokenId].milestones[milestone - 1] != 0) {
            uint256 amountToTransfer = Math.mulDiv(
                deals[tokenId].maxDeposit,
                deals[tokenId].milestones[milestone - 1],
                100
            );
            DealVault(deals[tokenId].vault).transferToBorrower(
                deals[tokenId].borrower,
                amountToTransfer
            );
        }

        deals[tokenId].status++;
        emit DealMilestoneChanged(tokenId, milestone);
    }

    function setDealCompleted(uint256 tokenId) public onlyOwner {
        require(tokenId <= _nextTokenId, "Deal not found");
        require(deals[tokenId].status == 7, "all milestones must be completed");

        DealVault(deals[tokenId].vault).complete();

        deals[tokenId].status++;
        emit DealCompleted(tokenId);
    }
}
