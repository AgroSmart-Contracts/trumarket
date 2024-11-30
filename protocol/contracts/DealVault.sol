// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DealVault is ERC4626, Ownable, Pausable {
    uint256 _maxDeposit;
    uint256 _maxMint;
    address _underlying;
    bool _deposit_blocked;

    constructor(
        address underlying,
        uint256 maxDeposit,
        uint256 maxMint,
        address owner
    ) ERC20("Deal Shares", "DLS") ERC4626(IERC20(underlying)) Ownable(owner) {
        _maxDeposit = maxDeposit;
        _maxMint = maxMint;
        _underlying = underlying;
        IERC20(underlying).approve(msg.sender, maxDeposit);
    }

    function maxDeposit(address) public view override returns (uint256) {
        return _maxDeposit - totalAssets();
    }

    function maxMint(address) public view override returns (uint256) {
        return _maxMint - totalAssets();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        return super.redeem(shares, receiver, owner);
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        return super.withdraw(assets, receiver, owner);
    }

    function blockDeposits() public onlyOwner {
        _deposit_blocked = true;
    }

    function complete() public onlyOwner {
        require(totalAssets() > _maxDeposit, "Waiting for borrower funds");

        unpause();
    }

    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(_deposit_blocked == false, "Forbidden");
        return super.deposit(assets, receiver);
    }

    function mint(
        uint256 shares,
        address receiver
    ) public virtual override returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(_deposit_blocked == false, "Forbidden");
        return super.mint(shares, receiver);
    }

    function transferToBorrower(
        address borrower,
        uint256 amount
    ) public onlyOwner {
        IERC20(_underlying).transfer(borrower, amount);
    }
}
