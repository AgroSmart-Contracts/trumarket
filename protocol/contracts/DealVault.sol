// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DealVault
 * @dev A vault contract that manages deposits, withdrawals, and fund transfers for deals
 * @notice This contract implements ERC4626 for tokenized vault shares and includes reentrancy protection
 * and inflation attack prevention
 */
contract DealVault is ERC4626, Ownable, Pausable, ReentrancyGuard {
    /// @notice Maximum amount that can be deposited into the vault
    uint256 private _maxDeposit;
    /// @notice Maximum amount of shares that can be minted
    uint256 private _maxMint;
    /// @notice Address of the underlying token (e.g., USDC)
    address private _underlying;
    /// @notice Flag indicating if deposits are blocked
    bool private _depositBlocked;

    /// @notice Minimum deposit amount to prevent inflation attacks
    uint256 private _minDeposit;
    /// @notice Tracks the actual accounting balance of assets to protect against direct transfers
    uint256 private _accountingBalance;
    /// @notice Initial deposit amount
    uint256 private _initialDeposit;

    /// @notice Emitted when deposits are blocked
    event DepositsBlocked();
    /// @notice Emitted when deposits are unblocked
    event DepositsUnblocked();
    /// @notice Emitted when funds are transferred to the borrower
    event TransferToBorrower(address indexed borrower, uint256 amount);
    /// @notice Emitted when the deal is completed
    event DealCompleted();
    /// @notice Emitted when a donation is made
    event Donation(address indexed donor, uint256 amount);

    /**
     * @dev Initializes the vault with the underlying token and maximum deposit/mint values
     * @param underlying_ Address of the underlying token
     * @param maxDeposit_ Maximum amount that can be deposited
     * @param maxMint_ Maximum amount of shares that can be minted
     * @param owner_ Address of the vault owner
     */
    constructor(
        address underlying_,
        uint256 maxDeposit_,
        uint256 maxMint_,
        address owner_
    ) ERC20("Deal Shares", "DLS") ERC4626(IERC20(underlying_)) Ownable(owner_) {
        require(underlying_ != address(0), "Invalid underlying token");
        require(maxDeposit_ > 0, "Max deposit must be positive");
        require(maxMint_ > 0, "Max mint must be positive");

        _maxDeposit = maxDeposit_;
        _maxMint = maxMint_;
        _underlying = underlying_;
        _minDeposit = 1e18; // Set a reasonable minimum deposit (e.g., 1 USDC if decimals=6)
        IERC20(underlying_).approve(msg.sender, maxDeposit_);

        // Initialize with non-zero values to prevent first deposit attack
        _mint(address(1), 1); // Mint a minimal share to a burned address
        _accountingBalance = 1; // Initialize with minimal balance
    }

    /**
     * @notice Returns the total amount of the underlying asset held by the vault
     * @return Amount of assets
     */
    function totalAssets() public view virtual override returns (uint256) {
        return _accountingBalance;
    }

    /**
     * @notice Override asset to update accounting when direct transfers occur
     * @return The address of the asset token
     */
    function asset() public view virtual override returns (address) {
        return _underlying;
    }

    /**
     * @notice Sync the accounting balance with the actual token balance
     * @dev This function is called before any deposit or withdrawal operation
     */
    function _syncAccounting() internal {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        if (currentBalance > _accountingBalance) {
            // If there was a direct transfer to the contract, we don't increase the accounting balance
            // This effectively dilutes the donation across all share holders
            // We don't need to do anything here
        } else if (currentBalance < _accountingBalance) {
            // This should not happen under normal circumstances, but we adjust if needed
            _accountingBalance = currentBalance;
        }
    }

    /**
     * @notice Returns the maximum amount that can be deposited
     * @param account Address of the account (unused)
     * @return Maximum amount that can be deposited
     */
    function maxDeposit(
        address account
    ) public view override returns (uint256) {
        return _maxDeposit - _accountingBalance + 1;
    }

    /**
     * @notice Returns the maximum amount of shares that can be minted
     * @param account Address of the account (unused)
     * @return Maximum amount of shares that can be minted
     */
    function maxMint(address account) public view override returns (uint256) {
        return _maxMint - _accountingBalance + 1;
    }

    /**
     * @notice Pauses all vault operations
     * @dev Only callable by the owner
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses all vault operations
     * @dev Only callable by the owner
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Deposits underlying tokens into the vault
     * @dev Includes reentrancy protection and requires the vault to be unpaused
     * @param assets Amount of underlying tokens to deposit
     * @param receiver Address to receive the vault shares
     * @return Amount of shares minted
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override nonReentrant returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(_depositBlocked == false, "Forbidden");
        require(receiver != address(0), "Invalid receiver address");
        require(assets >= _minDeposit, "Deposit amount below minimum");

        // Sync accounting before calculating shares
        _syncAccounting();

        // Calculate shares based on our accounting balance, not actual token balance
        uint256 supply = super.totalSupply();
        uint256 shares;

        if (supply == 1) {
            // Only the burned share exists
            // For first deposit, use 1:1 ratio
            shares = assets;
        } else {
            // For subsequent deposits, calculate based on current ratio
            shares = (assets * supply) / _accountingBalance;
        }

        // Ensure minimum share amount to prevent dust attacks
        require(shares > 0, "Share amount too small");

        // Update accounting balance
        _accountingBalance += assets;

        // Transfer tokens and mint shares
        IERC20(asset()).transferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);

        return shares;
    }

    /**
     * @notice Mints vault shares
     * @dev Includes reentrancy protection and requires the vault to be unpaused
     * @param shares Amount of shares to mint
     * @param receiver Address to receive the vault shares
     * @return Amount of underlying tokens deposited
     */
    function mint(
        uint256 shares,
        address receiver
    ) public virtual override nonReentrant returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(_depositBlocked == false, "Forbidden");
        require(receiver != address(0), "Invalid receiver address");
        require(shares > 0, "Share amount must be positive");

        // Sync accounting before calculating assets
        _syncAccounting();

        // Calculate assets based on our accounting balance, not actual token balance
        uint256 supply = super.totalSupply();
        uint256 assets;

        if (supply == 1) {
            // Only the burned share exists
            // For first mint, use 1:1 ratio
            assets = shares;
        } else {
            // For subsequent mints, calculate based on current ratio
            assets = (shares * _accountingBalance) / supply;
        }

        require(assets >= _minDeposit, "Equivalent asset amount below minimum");

        // Update accounting balance
        _accountingBalance += assets;

        // Transfer tokens and mint shares
        IERC20(asset()).transferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);

        return assets;
    }

    /**
     * @notice Redeems shares for underlying tokens
     * @dev Includes reentrancy protection and requires the vault to be unpaused
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive the underlying tokens
     * @param owner Address of the share owner
     * @return Amount of underlying tokens received
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual override nonReentrant returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(receiver != address(0), "Invalid receiver address");
        require(owner != address(0), "Invalid owner address");

        // Sync accounting before calculating assets
        _syncAccounting();

        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        // Calculate assets based on our accounting balance, not actual token balance
        uint256 supply = super.totalSupply();
        uint256 assets = (shares * _accountingBalance) / supply;

        // Update accounting balance
        _accountingBalance -= assets;

        // Burn shares and transfer tokens
        _burn(owner, shares);
        IERC20(asset()).transfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        return assets;
    }

    /**
     * @notice Withdraws underlying tokens
     * @dev Includes reentrancy protection and requires the vault to be unpaused
     * @param assets Amount of underlying tokens to withdraw
     * @param receiver Address to receive the underlying tokens
     * @param owner Address of the share owner
     * @return Amount of shares burned
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override nonReentrant returns (uint256) {
        require(paused() == false, "Unfinished Deal");
        require(receiver != address(0), "Invalid receiver address");
        require(owner != address(0), "Invalid owner address");

        // Sync accounting before calculating shares
        _syncAccounting();

        // Calculate shares based on our accounting balance, not actual token balance
        uint256 supply = super.totalSupply();
        uint256 shares = (assets * supply) / _accountingBalance;

        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        // Update accounting balance
        _accountingBalance -= assets;

        // Burn shares and transfer tokens
        _burn(owner, shares);
        IERC20(asset()).transfer(receiver, assets);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        return shares;
    }

    /**
     * @notice Blocks all deposits to the vault
     * @dev Only callable by the owner
     */
    function blockDeposits() public onlyOwner {
        _depositBlocked = true;
        emit DepositsBlocked();
    }

    /**
     * @notice Unblocks deposits to the vault
     * @dev Only callable by the owner
     */
    function unblockDeposits() public onlyOwner {
        _depositBlocked = false;
        emit DepositsUnblocked();
    }

    /**
     * @notice Completes the deal and unpauses the vault
     * @dev Only callable by the owner and includes reentrancy protection
     */
    function complete() public onlyOwner nonReentrant {
        require(_accountingBalance > _maxDeposit, "Waiting for borrower funds");
        unpause();
        emit DealCompleted();
    }

    /**
     * @notice Transfers underlying tokens to the borrower
     * @dev Only callable by the owner and includes reentrancy protection
     * @param borrower Address of the borrower
     * @param amount Amount of underlying tokens to transfer
     */
    function transferToBorrower(
        address borrower,
        uint256 amount
    ) public onlyOwner nonReentrant {
        require(borrower != address(0), "Invalid borrower address");
        require(amount > 0, "Amount must be positive");
        require(amount <= _accountingBalance, "Insufficient funds");

        // Update accounting balance
        _accountingBalance -= amount;

        IERC20(_underlying).transfer(borrower, amount);
        emit TransferToBorrower(borrower, amount);
    }

    /**
     * @notice Updates the minimum deposit amount
     * @dev Only callable by the owner
     * @param minDeposit_ New minimum deposit amount
     */
    function setMinDeposit(uint256 minDeposit_) public onlyOwner {
        require(minDeposit_ > 0, "Minimum deposit must be positive");
        _minDeposit = minDeposit_;
    }

    /**
     * @notice Allows the owner to donate funds to the vault
     * @dev Only callable by the owner and includes reentrancy protection
     * @param amount Amount of underlying tokens to donate
     */
    function donate(uint256 amount) public onlyOwner nonReentrant {
        require(amount > 0, "Amount must be positive");

        // Transfer tokens from owner to vault
        IERC20(_underlying).transferFrom(msg.sender, address(this), amount);

        // Update accounting balance
        _accountingBalance += amount;

        emit Donation(msg.sender, amount);
    }

    /**
     * @notice Returns the minimum deposit amount
     * @return Minimum deposit amount
     */
    function minDeposit() public view returns (uint256) {
        return _minDeposit;
    }

    /**
     * @notice Returns whether deposits are blocked
     * @return True if deposits are blocked, false otherwise
     */
    function depositBlocked() public view returns (bool) {
        return _depositBlocked;
    }
}
