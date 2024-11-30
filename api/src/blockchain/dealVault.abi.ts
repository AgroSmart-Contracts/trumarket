export const DEAL_VAULT_ABI = {
  _format: 'hh-sol-artifact-1',
  contractName: 'DealVault',
  sourceName: 'contracts/DealVault.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'underlying',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'maxDeposit',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'maxMint',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'allowance',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'needed',
          type: 'uint256',
        },
      ],
      name: 'ERC20InsufficientAllowance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'needed',
          type: 'uint256',
        },
      ],
      name: 'ERC20InsufficientBalance',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'approver',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidApprover',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidReceiver',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidSender',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'ERC20InvalidSpender',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'max',
          type: 'uint256',
        },
      ],
      name: 'ERC4626ExceededMaxDeposit',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'max',
          type: 'uint256',
        },
      ],
      name: 'ERC4626ExceededMaxMint',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'max',
          type: 'uint256',
        },
      ],
      name: 'ERC4626ExceededMaxRedeem',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'max',
          type: 'uint256',
        },
      ],
      name: 'ERC4626ExceededMaxWithdraw',
      type: 'error',
    },
    {
      inputs: [],
      name: 'EnforcedPause',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ExpectedPause',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'OwnableInvalidOwner',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'OwnableUnauthorizedAccount',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address',
        },
      ],
      name: 'SafeERC20FailedOperation',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Paused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Unpaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
      ],
      name: 'Withdraw',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'asset',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'blockDeposits',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'complete',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
      ],
      name: 'convertToAssets',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
      ],
      name: 'convertToShares',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
      ],
      name: 'deposit',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'maxDeposit',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'maxMint',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'maxRedeem',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'maxWithdraw',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
      ],
      name: 'mint',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
      ],
      name: 'previewDeposit',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
      ],
      name: 'previewMint',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
      ],
      name: 'previewRedeem',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
      ],
      name: 'previewWithdraw',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'redeem',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalAssets',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'borrower',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'transferToBorrower',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assets',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'withdraw',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode:
    '0x60c06040523480156200001157600080fd5b50604051620035413803806200354183398181016040528101906200003791906200053b565b80846040518060400160405280600b81526020017f4465616c205368617265730000000000000000000000000000000000000000008152506040518060400160405280600381526020017f444c5300000000000000000000000000000000000000000000000000000000008152508160039081620000b691906200081d565b508060049081620000c891906200081d565b505050600080620000df83620002b660201b60201c565b9150915081620000f1576012620000f3565b805b60ff1660a08160ff16815250508273ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620001ac5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620001a3919062000915565b60405180910390fd5b620001bd81620003d060201b60201c565b506000600560146101000a81548160ff021916908315150217905550826006819055508160078190555083600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508373ffffffffffffffffffffffffffffffffffffffff1663095ea7b333856040518363ffffffff1660e01b81526004016200026592919062000943565b6020604051808303816000875af115801562000285573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002ab9190620009ad565b505050505062000aa3565b6000806000808473ffffffffffffffffffffffffffffffffffffffff1660405160240160405160208183030381529060405263313ce56760e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516200032d919062000a58565b600060405180830381855afa9150503d80600081146200036a576040519150601f19603f3d011682016040523d82523d6000602084013e6200036f565b606091505b50915091508180156200038457506020815110155b15620003c157600081806020019051810190620003a2919062000a71565b905060ff80168111620003bf5760018194509450505050620003cb565b505b6000809350935050505b915091565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620004c8826200049b565b9050919050565b620004da81620004bb565b8114620004e657600080fd5b50565b600081519050620004fa81620004cf565b92915050565b6000819050919050565b620005158162000500565b81146200052157600080fd5b50565b60008151905062000535816200050a565b92915050565b6000806000806080858703121562000558576200055762000496565b5b60006200056887828801620004e9565b94505060206200057b8782880162000524565b93505060406200058e8782880162000524565b9250506060620005a187828801620004e9565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200062f57607f821691505b602082108103620006455762000644620005e7565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006af7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000670565b620006bb868362000670565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620006fe620006f8620006f28462000500565b620006d3565b62000500565b9050919050565b6000819050919050565b6200071a83620006dd565b62000732620007298262000705565b8484546200067d565b825550505050565b600090565b620007496200073a565b620007568184846200070f565b505050565b5b818110156200077e57620007726000826200073f565b6001810190506200075c565b5050565b601f821115620007cd5762000797816200064b565b620007a28462000660565b81016020851015620007b2578190505b620007ca620007c18562000660565b8301826200075b565b50505b505050565b600082821c905092915050565b6000620007f260001984600802620007d2565b1980831691505092915050565b60006200080d8383620007df565b9150826002028217905092915050565b6200082882620005ad565b67ffffffffffffffff811115620008445762000843620005b8565b5b62000850825462000616565b6200085d82828562000782565b600060209050601f83116001811462000895576000841562000880578287015190505b6200088c8582620007ff565b865550620008fc565b601f198416620008a5866200064b565b60005b82811015620008cf57848901518255600182019150602085019450602081019050620008a8565b86831015620008ef5784890151620008eb601f891682620007df565b8355505b6001600288020188555050505b505050505050565b6200090f81620004bb565b82525050565b60006020820190506200092c600083018462000904565b92915050565b6200093d8162000500565b82525050565b60006040820190506200095a600083018562000904565b62000969602083018462000932565b9392505050565b60008115159050919050565b620009878162000970565b81146200099357600080fd5b50565b600081519050620009a7816200097c565b92915050565b600060208284031215620009c657620009c562000496565b5b6000620009d68482850162000996565b91505092915050565b600081519050919050565b600081905092915050565b60005b8381101562000a15578082015181840152602081019050620009f8565b60008484015250505050565b600062000a2e82620009df565b62000a3a8185620009ea565b935062000a4c818560208601620009f5565b80840191505092915050565b600062000a66828462000a21565b915081905092915050565b60006020828403121562000a8a5762000a8962000496565b5b600062000a9a8482850162000524565b91505092915050565b60805160a051612a6362000ade60003960006109650152600081816106f90152818161099701528181611ab60152611be30152612a636000f3fe608060405234801561001057600080fd5b50600436106102065760003560e01c8063715018a61161011a578063ba087652116100ad578063ce96cb771161007c578063ce96cb7714610619578063d905777e14610649578063dd62ed3e14610679578063ef8b30f7146106a9578063f2fde38b146106d957610206565b8063ba0876521461057f578063c63d75b6146105af578063c6e6f592146105df578063c76ce2ef1461060f57610206565b806395d89b41116100e957806395d89b41146104d1578063a9059cbb146104ef578063b3d7f6b91461051f578063b460af941461054f57610206565b8063715018a61461046f5780638456cb59146104795780638da5cb5b1461048357806394bf804d146104a157610206565b8063313ce5671161019d5780634cdad5061161016c5780634cdad506146103b7578063522e1177146103e75780635c975abb146103f15780636e553f651461040f57806370a082311461043f57610206565b8063313ce5671461034157806338d52e0f1461035f5780633f4ba83a1461037d578063402d267d1461038757610206565b80630a28a477116101d95780630a28a477146102a75780631136758d146102d757806318160ddd146102f357806323b872dd1461031157610206565b806301e1d1141461020b57806306fdde031461022957806307a2d13a14610247578063095ea7b314610277575b600080fd5b6102136106f5565b60405161022091906120a2565b60405180910390f35b610231610796565b60405161023e919061214d565b60405180910390f35b610261600480360381019061025c91906121a0565b610828565b60405161026e91906120a2565b60405180910390f35b610291600480360381019061028c919061222b565b61083c565b60405161029e9190612286565b60405180910390f35b6102c160048036038101906102bc91906121a0565b61085f565b6040516102ce91906120a2565b60405180910390f35b6102f160048036038101906102ec919061222b565b610873565b005b6102fb610920565b60405161030891906120a2565b60405180910390f35b61032b600480360381019061032691906122a1565b61092a565b6040516103389190612286565b60405180910390f35b610349610959565b6040516103569190612310565b60405180910390f35b610367610993565b604051610374919061233a565b60405180910390f35b6103856109bb565b005b6103a1600480360381019061039c9190612355565b6109cd565b6040516103ae91906120a2565b60405180910390f35b6103d160048036038101906103cc91906121a0565b6109eb565b6040516103de91906120a2565b60405180910390f35b6103ef6109ff565b005b6103f9610a5c565b6040516104069190612286565b60405180910390f35b61042960048036038101906104249190612382565b610a73565b60405161043691906120a2565b60405180910390f35b61045960048036038101906104549190612355565b610b2a565b60405161046691906120a2565b60405180910390f35b610477610b72565b005b610481610b86565b005b61048b610b98565b604051610498919061233a565b60405180910390f35b6104bb60048036038101906104b69190612382565b610bc2565b6040516104c891906120a2565b60405180910390f35b6104d9610c79565b6040516104e6919061214d565b60405180910390f35b6105096004803603810190610504919061222b565b610d0b565b6040516105169190612286565b60405180910390f35b610539600480360381019061053491906121a0565b610d2e565b60405161054691906120a2565b60405180910390f35b610569600480360381019061056491906123c2565b610d42565b60405161057691906120a2565b60405180910390f35b610599600480360381019061059491906123c2565b610da5565b6040516105a691906120a2565b60405180910390f35b6105c960048036038101906105c49190612355565b610e08565b6040516105d691906120a2565b60405180910390f35b6105f960048036038101906105f491906121a0565b610e26565b60405161060691906120a2565b60405180910390f35b610617610e3a565b005b610633600480360381019061062e9190612355565b610e5f565b60405161064091906120a2565b60405180910390f35b610663600480360381019061065e9190612355565b610e7b565b60405161067091906120a2565b60405180910390f35b610693600480360381019061068e9190612415565b610e8d565b6040516106a091906120a2565b60405180910390f35b6106c360048036038101906106be91906121a0565b610f14565b6040516106d091906120a2565b60405180910390f35b6106f360048036038101906106ee9190612355565b610f28565b005b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610750919061233a565b602060405180830381865afa15801561076d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610791919061246a565b905090565b6060600380546107a5906124c6565b80601f01602080910402602001604051908101604052809291908181526020018280546107d1906124c6565b801561081e5780601f106107f35761010080835404028352916020019161081e565b820191906000526020600020905b81548152906001019060200180831161080157829003601f168201915b5050505050905090565b6000610835826000610fae565b9050919050565b600080610847611007565b905061085481858561100f565b600191505092915050565b600061086c826001611021565b9050919050565b61087b61107a565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b81526004016108d89291906124f7565b6020604051808303816000875af11580156108f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091b919061254c565b505050565b6000600254905090565b600080610935611007565b9050610942858285611101565b61094d858585611195565b60019150509392505050565b6000610963611289565b7f000000000000000000000000000000000000000000000000000000000000000061098e91906125a8565b905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6109c361107a565b6109cb61128e565b565b60006109d76106f5565b6006546109e491906125dd565b9050919050565b60006109f8826000610fae565b9050919050565b610a0761107a565b600654610a126106f5565b11610a52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a499061265d565b60405180910390fd5b610a5a6109bb565b565b6000600560149054906101000a900460ff16905090565b6000801515610a80610a5c565b151514610ac2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab9906126c9565b60405180910390fd5b60001515600860149054906101000a900460ff16151514610b18576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0f90612735565b60405180910390fd5b610b2283836112f1565b905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610b7a61107a565b610b846000611373565b565b610b8e61107a565b610b96611439565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000801515610bcf610a5c565b151514610c11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c08906126c9565b60405180910390fd5b60001515600860149054906101000a900460ff16151514610c67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5e90612735565b60405180910390fd5b610c71838361149c565b905092915050565b606060048054610c88906124c6565b80601f0160208091040260200160405190810160405280929190818152602001828054610cb4906124c6565b8015610d015780601f10610cd657610100808354040283529160200191610d01565b820191906000526020600020905b815481529060010190602001808311610ce457829003601f168201915b5050505050905090565b600080610d16611007565b9050610d23818585611195565b600191505092915050565b6000610d3b826001610fae565b9050919050565b6000801515610d4f610a5c565b151514610d91576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d88906126c9565b60405180910390fd5b610d9c84848461151e565b90509392505050565b6000801515610db2610a5c565b151514610df4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610deb906126c9565b60405180910390fd5b610dff8484846115a2565b90509392505050565b6000610e126106f5565b600754610e1f91906125dd565b9050919050565b6000610e33826000611021565b9050919050565b610e4261107a565b6001600860146101000a81548160ff021916908315150217905550565b6000610e74610e6d83610b2a565b6000610fae565b9050919050565b6000610e8682610b2a565b9050919050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000610f21826000611021565b9050919050565b610f3061107a565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610fa25760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610f99919061233a565b60405180910390fd5b610fab81611373565b50565b6000610fff6001610fbd6106f5565b610fc79190612755565b610fcf611289565b600a610fdb91906128bc565b610fe3610920565b610fed9190612755565b8486611626909392919063ffffffff16565b905092915050565b600033905090565b61101c8383836001611675565b505050565b600061107261102e611289565b600a61103a91906128bc565b611042610920565b61104c9190612755565b60016110566106f5565b6110609190612755565b8486611626909392919063ffffffff16565b905092915050565b611082611007565b73ffffffffffffffffffffffffffffffffffffffff166110a0610b98565b73ffffffffffffffffffffffffffffffffffffffff16146110ff576110c3611007565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016110f6919061233a565b60405180910390fd5b565b600061110d8484610e8d565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461118f578181101561117f578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161117693929190612907565b60405180910390fd5b61118e84848484036000611675565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036112075760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016111fe919061233a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036112795760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401611270919061233a565b60405180910390fd5b61128483838361184c565b505050565b600090565b611296611a71565b6000600560146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6112da611007565b6040516112e7919061233a565b60405180910390a1565b6000806112fd836109cd565b905080841115611348578284826040517f79012fb200000000000000000000000000000000000000000000000000000000815260040161133f93929190612907565b60405180910390fd5b600061135385610f14565b9050611368611360611007565b858784611ab1565b809250505092915050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611441611b54565b6001600560146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611485611007565b604051611492919061233a565b60405180910390a1565b6000806114a883610e08565b9050808411156114f3578284826040517f284ff6670000000000000000000000000000000000000000000000000000000081526004016114ea93929190612907565b60405180910390fd5b60006114fe85610d2e565b905061151361150b611007565b858388611ab1565b809250505092915050565b60008061152a83610e5f565b905080851115611575578285826040517ffe9cceec00000000000000000000000000000000000000000000000000000000815260040161156c93929190612907565b60405180910390fd5b60006115808661085f565b905061159661158d611007565b86868985611b95565b80925050509392505050565b6000806115ae83610e7b565b9050808511156115f9578285826040517fb94abeec0000000000000000000000000000000000000000000000000000000081526004016115f093929190612907565b60405180910390fd5b6000611604866109eb565b905061161a611611611007565b8686848a611b95565b80925050509392505050565b600061165661163483611c8e565b801561165157506000848061164c5761164b61293e565b5b868809115b611cbc565b611661868686611cc8565b61166b9190612755565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036116e75760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016116de919061233a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036117595760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401611750919061233a565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015611846578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161183d91906120a2565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361189e5780600260008282546118929190612755565b92505081905550611971565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561192a578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161192193929190612907565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036119ba5780600260008282540392505081905550611a07565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051611a6491906120a2565b60405180910390a3505050565b611a79610a5c565b611aaf576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b611add7f0000000000000000000000000000000000000000000000000000000000000000853085611db6565b611ae78382611e38565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78484604051611b4692919061296d565b60405180910390a350505050565b611b5c610a5c565b15611b93576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b8273ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614611bd457611bd3838683611101565b5b611bde8382611eba565b611c097f00000000000000000000000000000000000000000000000000000000000000008584611f3c565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db8585604051611c7f92919061296d565b60405180910390a45050505050565b600060016002836003811115611ca757611ca6612996565b5b611cb191906129c5565b60ff16149050919050565b60008115159050919050565b6000808385029050600080198587098281108382030391505060008103611d0357838281611cf957611cf861293e565b5b0492505050611daf565b808411611d2357611d22611d1d6000861460126011611fbb565b611fd5565b5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b611e32848573ffffffffffffffffffffffffffffffffffffffff166323b872dd868686604051602401611deb939291906129f6565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fe7565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611eaa5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401611ea1919061233a565b60405180910390fd5b611eb66000838361184c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611f2c5760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401611f23919061233a565b60405180910390fd5b611f388260008361184c565b5050565b611fb6838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8585604051602401611f6f9291906124f7565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fe7565b505050565b6000611fc684611cbc565b82841802821890509392505050565b634e487b71600052806020526024601cfd5b600080602060008451602086016000885af18061200a576040513d6000823e3d81fd5b3d925060005191505060008214612025576001811415612041565b60008473ffffffffffffffffffffffffffffffffffffffff163b145b1561208357836040517f5274afe700000000000000000000000000000000000000000000000000000000815260040161207a919061233a565b60405180910390fd5b50505050565b6000819050919050565b61209c81612089565b82525050565b60006020820190506120b76000830184612093565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156120f75780820151818401526020810190506120dc565b60008484015250505050565b6000601f19601f8301169050919050565b600061211f826120bd565b61212981856120c8565b93506121398185602086016120d9565b61214281612103565b840191505092915050565b600060208201905081810360008301526121678184612114565b905092915050565b600080fd5b61217d81612089565b811461218857600080fd5b50565b60008135905061219a81612174565b92915050565b6000602082840312156121b6576121b561216f565b5b60006121c48482850161218b565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006121f8826121cd565b9050919050565b612208816121ed565b811461221357600080fd5b50565b600081359050612225816121ff565b92915050565b600080604083850312156122425761224161216f565b5b600061225085828601612216565b92505060206122618582860161218b565b9150509250929050565b60008115159050919050565b6122808161226b565b82525050565b600060208201905061229b6000830184612277565b92915050565b6000806000606084860312156122ba576122b961216f565b5b60006122c886828701612216565b93505060206122d986828701612216565b92505060406122ea8682870161218b565b9150509250925092565b600060ff82169050919050565b61230a816122f4565b82525050565b60006020820190506123256000830184612301565b92915050565b612334816121ed565b82525050565b600060208201905061234f600083018461232b565b92915050565b60006020828403121561236b5761236a61216f565b5b600061237984828501612216565b91505092915050565b600080604083850312156123995761239861216f565b5b60006123a78582860161218b565b92505060206123b885828601612216565b9150509250929050565b6000806000606084860312156123db576123da61216f565b5b60006123e98682870161218b565b93505060206123fa86828701612216565b925050604061240b86828701612216565b9150509250925092565b6000806040838503121561242c5761242b61216f565b5b600061243a85828601612216565b925050602061244b85828601612216565b9150509250929050565b60008151905061246481612174565b92915050565b6000602082840312156124805761247f61216f565b5b600061248e84828501612455565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806124de57607f821691505b6020821081036124f1576124f0612497565b5b50919050565b600060408201905061250c600083018561232b565b6125196020830184612093565b9392505050565b6125298161226b565b811461253457600080fd5b50565b60008151905061254681612520565b92915050565b6000602082840312156125625761256161216f565b5b600061257084828501612537565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006125b3826122f4565b91506125be836122f4565b9250828201905060ff8111156125d7576125d6612579565b5b92915050565b60006125e882612089565b91506125f383612089565b925082820390508181111561260b5761260a612579565b5b92915050565b7f57616974696e6720666f7220626f72726f7765722066756e6473000000000000600082015250565b6000612647601a836120c8565b915061265282612611565b602082019050919050565b600060208201905081810360008301526126768161263a565b9050919050565b7f556e66696e6973686564204465616c0000000000000000000000000000000000600082015250565b60006126b3600f836120c8565b91506126be8261267d565b602082019050919050565b600060208201905081810360008301526126e2816126a6565b9050919050565b7f466f7262696464656e0000000000000000000000000000000000000000000000600082015250565b600061271f6009836120c8565b915061272a826126e9565b602082019050919050565b6000602082019050818103600083015261274e81612712565b9050919050565b600061276082612089565b915061276b83612089565b925082820190508082111561278357612782612579565b5b92915050565b60008160011c9050919050565b6000808291508390505b60018511156127e0578086048111156127bc576127bb612579565b5b60018516156127cb5780820291505b80810290506127d985612789565b94506127a0565b94509492505050565b6000826127f957600190506128b5565b8161280757600090506128b5565b816001811461281d576002811461282757612856565b60019150506128b5565b60ff84111561283957612838612579565b5b8360020a9150848211156128505761284f612579565b5b506128b5565b5060208310610133831016604e8410600b841016171561288b5782820a90508381111561288657612885612579565b5b6128b5565b6128988484846001612796565b925090508184048111156128af576128ae612579565b5b81810290505b9392505050565b60006128c782612089565b91506128d2836122f4565b92506128ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846127e9565b905092915050565b600060608201905061291c600083018661232b565b6129296020830185612093565b6129366040830184612093565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006040820190506129826000830185612093565b61298f6020830184612093565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60006129d0826122f4565b91506129db836122f4565b9250826129eb576129ea61293e565b5b828206905092915050565b6000606082019050612a0b600083018661232b565b612a18602083018561232b565b612a256040830184612093565b94935050505056fea264697066735822122072dfb79c0145951b65766f2ffdd444fad4b1fa9eb3cf521b0b038eea1adff24864736f6c63430008180033',
  deployedBytecode:
    '0x608060405234801561001057600080fd5b50600436106102065760003560e01c8063715018a61161011a578063ba087652116100ad578063ce96cb771161007c578063ce96cb7714610619578063d905777e14610649578063dd62ed3e14610679578063ef8b30f7146106a9578063f2fde38b146106d957610206565b8063ba0876521461057f578063c63d75b6146105af578063c6e6f592146105df578063c76ce2ef1461060f57610206565b806395d89b41116100e957806395d89b41146104d1578063a9059cbb146104ef578063b3d7f6b91461051f578063b460af941461054f57610206565b8063715018a61461046f5780638456cb59146104795780638da5cb5b1461048357806394bf804d146104a157610206565b8063313ce5671161019d5780634cdad5061161016c5780634cdad506146103b7578063522e1177146103e75780635c975abb146103f15780636e553f651461040f57806370a082311461043f57610206565b8063313ce5671461034157806338d52e0f1461035f5780633f4ba83a1461037d578063402d267d1461038757610206565b80630a28a477116101d95780630a28a477146102a75780631136758d146102d757806318160ddd146102f357806323b872dd1461031157610206565b806301e1d1141461020b57806306fdde031461022957806307a2d13a14610247578063095ea7b314610277575b600080fd5b6102136106f5565b60405161022091906120a2565b60405180910390f35b610231610796565b60405161023e919061214d565b60405180910390f35b610261600480360381019061025c91906121a0565b610828565b60405161026e91906120a2565b60405180910390f35b610291600480360381019061028c919061222b565b61083c565b60405161029e9190612286565b60405180910390f35b6102c160048036038101906102bc91906121a0565b61085f565b6040516102ce91906120a2565b60405180910390f35b6102f160048036038101906102ec919061222b565b610873565b005b6102fb610920565b60405161030891906120a2565b60405180910390f35b61032b600480360381019061032691906122a1565b61092a565b6040516103389190612286565b60405180910390f35b610349610959565b6040516103569190612310565b60405180910390f35b610367610993565b604051610374919061233a565b60405180910390f35b6103856109bb565b005b6103a1600480360381019061039c9190612355565b6109cd565b6040516103ae91906120a2565b60405180910390f35b6103d160048036038101906103cc91906121a0565b6109eb565b6040516103de91906120a2565b60405180910390f35b6103ef6109ff565b005b6103f9610a5c565b6040516104069190612286565b60405180910390f35b61042960048036038101906104249190612382565b610a73565b60405161043691906120a2565b60405180910390f35b61045960048036038101906104549190612355565b610b2a565b60405161046691906120a2565b60405180910390f35b610477610b72565b005b610481610b86565b005b61048b610b98565b604051610498919061233a565b60405180910390f35b6104bb60048036038101906104b69190612382565b610bc2565b6040516104c891906120a2565b60405180910390f35b6104d9610c79565b6040516104e6919061214d565b60405180910390f35b6105096004803603810190610504919061222b565b610d0b565b6040516105169190612286565b60405180910390f35b610539600480360381019061053491906121a0565b610d2e565b60405161054691906120a2565b60405180910390f35b610569600480360381019061056491906123c2565b610d42565b60405161057691906120a2565b60405180910390f35b610599600480360381019061059491906123c2565b610da5565b6040516105a691906120a2565b60405180910390f35b6105c960048036038101906105c49190612355565b610e08565b6040516105d691906120a2565b60405180910390f35b6105f960048036038101906105f491906121a0565b610e26565b60405161060691906120a2565b60405180910390f35b610617610e3a565b005b610633600480360381019061062e9190612355565b610e5f565b60405161064091906120a2565b60405180910390f35b610663600480360381019061065e9190612355565b610e7b565b60405161067091906120a2565b60405180910390f35b610693600480360381019061068e9190612415565b610e8d565b6040516106a091906120a2565b60405180910390f35b6106c360048036038101906106be91906121a0565b610f14565b6040516106d091906120a2565b60405180910390f35b6106f360048036038101906106ee9190612355565b610f28565b005b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610750919061233a565b602060405180830381865afa15801561076d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610791919061246a565b905090565b6060600380546107a5906124c6565b80601f01602080910402602001604051908101604052809291908181526020018280546107d1906124c6565b801561081e5780601f106107f35761010080835404028352916020019161081e565b820191906000526020600020905b81548152906001019060200180831161080157829003601f168201915b5050505050905090565b6000610835826000610fae565b9050919050565b600080610847611007565b905061085481858561100f565b600191505092915050565b600061086c826001611021565b9050919050565b61087b61107a565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b81526004016108d89291906124f7565b6020604051808303816000875af11580156108f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091b919061254c565b505050565b6000600254905090565b600080610935611007565b9050610942858285611101565b61094d858585611195565b60019150509392505050565b6000610963611289565b7f000000000000000000000000000000000000000000000000000000000000000061098e91906125a8565b905090565b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b6109c361107a565b6109cb61128e565b565b60006109d76106f5565b6006546109e491906125dd565b9050919050565b60006109f8826000610fae565b9050919050565b610a0761107a565b600654610a126106f5565b11610a52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a499061265d565b60405180910390fd5b610a5a6109bb565b565b6000600560149054906101000a900460ff16905090565b6000801515610a80610a5c565b151514610ac2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab9906126c9565b60405180910390fd5b60001515600860149054906101000a900460ff16151514610b18576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0f90612735565b60405180910390fd5b610b2283836112f1565b905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610b7a61107a565b610b846000611373565b565b610b8e61107a565b610b96611439565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000801515610bcf610a5c565b151514610c11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c08906126c9565b60405180910390fd5b60001515600860149054906101000a900460ff16151514610c67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5e90612735565b60405180910390fd5b610c71838361149c565b905092915050565b606060048054610c88906124c6565b80601f0160208091040260200160405190810160405280929190818152602001828054610cb4906124c6565b8015610d015780601f10610cd657610100808354040283529160200191610d01565b820191906000526020600020905b815481529060010190602001808311610ce457829003601f168201915b5050505050905090565b600080610d16611007565b9050610d23818585611195565b600191505092915050565b6000610d3b826001610fae565b9050919050565b6000801515610d4f610a5c565b151514610d91576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d88906126c9565b60405180910390fd5b610d9c84848461151e565b90509392505050565b6000801515610db2610a5c565b151514610df4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610deb906126c9565b60405180910390fd5b610dff8484846115a2565b90509392505050565b6000610e126106f5565b600754610e1f91906125dd565b9050919050565b6000610e33826000611021565b9050919050565b610e4261107a565b6001600860146101000a81548160ff021916908315150217905550565b6000610e74610e6d83610b2a565b6000610fae565b9050919050565b6000610e8682610b2a565b9050919050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000610f21826000611021565b9050919050565b610f3061107a565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610fa25760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610f99919061233a565b60405180910390fd5b610fab81611373565b50565b6000610fff6001610fbd6106f5565b610fc79190612755565b610fcf611289565b600a610fdb91906128bc565b610fe3610920565b610fed9190612755565b8486611626909392919063ffffffff16565b905092915050565b600033905090565b61101c8383836001611675565b505050565b600061107261102e611289565b600a61103a91906128bc565b611042610920565b61104c9190612755565b60016110566106f5565b6110609190612755565b8486611626909392919063ffffffff16565b905092915050565b611082611007565b73ffffffffffffffffffffffffffffffffffffffff166110a0610b98565b73ffffffffffffffffffffffffffffffffffffffff16146110ff576110c3611007565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016110f6919061233a565b60405180910390fd5b565b600061110d8484610e8d565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461118f578181101561117f578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161117693929190612907565b60405180910390fd5b61118e84848484036000611675565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036112075760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016111fe919061233a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036112795760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401611270919061233a565b60405180910390fd5b61128483838361184c565b505050565b600090565b611296611a71565b6000600560146101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6112da611007565b6040516112e7919061233a565b60405180910390a1565b6000806112fd836109cd565b905080841115611348578284826040517f79012fb200000000000000000000000000000000000000000000000000000000815260040161133f93929190612907565b60405180910390fd5b600061135385610f14565b9050611368611360611007565b858784611ab1565b809250505092915050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611441611b54565b6001600560146101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611485611007565b604051611492919061233a565b60405180910390a1565b6000806114a883610e08565b9050808411156114f3578284826040517f284ff6670000000000000000000000000000000000000000000000000000000081526004016114ea93929190612907565b60405180910390fd5b60006114fe85610d2e565b905061151361150b611007565b858388611ab1565b809250505092915050565b60008061152a83610e5f565b905080851115611575578285826040517ffe9cceec00000000000000000000000000000000000000000000000000000000815260040161156c93929190612907565b60405180910390fd5b60006115808661085f565b905061159661158d611007565b86868985611b95565b80925050509392505050565b6000806115ae83610e7b565b9050808511156115f9578285826040517fb94abeec0000000000000000000000000000000000000000000000000000000081526004016115f093929190612907565b60405180910390fd5b6000611604866109eb565b905061161a611611611007565b8686848a611b95565b80925050509392505050565b600061165661163483611c8e565b801561165157506000848061164c5761164b61293e565b5b868809115b611cbc565b611661868686611cc8565b61166b9190612755565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036116e75760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016116de919061233a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036117595760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401611750919061233a565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015611846578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161183d91906120a2565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361189e5780600260008282546118929190612755565b92505081905550611971565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561192a578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161192193929190612907565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036119ba5780600260008282540392505081905550611a07565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051611a6491906120a2565b60405180910390a3505050565b611a79610a5c565b611aaf576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b611add7f0000000000000000000000000000000000000000000000000000000000000000853085611db6565b611ae78382611e38565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78484604051611b4692919061296d565b60405180910390a350505050565b611b5c610a5c565b15611b93576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b8273ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614611bd457611bd3838683611101565b5b611bde8382611eba565b611c097f00000000000000000000000000000000000000000000000000000000000000008584611f3c565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db8585604051611c7f92919061296d565b60405180910390a45050505050565b600060016002836003811115611ca757611ca6612996565b5b611cb191906129c5565b60ff16149050919050565b60008115159050919050565b6000808385029050600080198587098281108382030391505060008103611d0357838281611cf957611cf861293e565b5b0492505050611daf565b808411611d2357611d22611d1d6000861460126011611fbb565b611fd5565b5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b611e32848573ffffffffffffffffffffffffffffffffffffffff166323b872dd868686604051602401611deb939291906129f6565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fe7565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611eaa5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401611ea1919061233a565b60405180910390fd5b611eb66000838361184c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603611f2c5760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401611f23919061233a565b60405180910390fd5b611f388260008361184c565b5050565b611fb6838473ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8585604051602401611f6f9291906124f7565b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611fe7565b505050565b6000611fc684611cbc565b82841802821890509392505050565b634e487b71600052806020526024601cfd5b600080602060008451602086016000885af18061200a576040513d6000823e3d81fd5b3d925060005191505060008214612025576001811415612041565b60008473ffffffffffffffffffffffffffffffffffffffff163b145b1561208357836040517f5274afe700000000000000000000000000000000000000000000000000000000815260040161207a919061233a565b60405180910390fd5b50505050565b6000819050919050565b61209c81612089565b82525050565b60006020820190506120b76000830184612093565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156120f75780820151818401526020810190506120dc565b60008484015250505050565b6000601f19601f8301169050919050565b600061211f826120bd565b61212981856120c8565b93506121398185602086016120d9565b61214281612103565b840191505092915050565b600060208201905081810360008301526121678184612114565b905092915050565b600080fd5b61217d81612089565b811461218857600080fd5b50565b60008135905061219a81612174565b92915050565b6000602082840312156121b6576121b561216f565b5b60006121c48482850161218b565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006121f8826121cd565b9050919050565b612208816121ed565b811461221357600080fd5b50565b600081359050612225816121ff565b92915050565b600080604083850312156122425761224161216f565b5b600061225085828601612216565b92505060206122618582860161218b565b9150509250929050565b60008115159050919050565b6122808161226b565b82525050565b600060208201905061229b6000830184612277565b92915050565b6000806000606084860312156122ba576122b961216f565b5b60006122c886828701612216565b93505060206122d986828701612216565b92505060406122ea8682870161218b565b9150509250925092565b600060ff82169050919050565b61230a816122f4565b82525050565b60006020820190506123256000830184612301565b92915050565b612334816121ed565b82525050565b600060208201905061234f600083018461232b565b92915050565b60006020828403121561236b5761236a61216f565b5b600061237984828501612216565b91505092915050565b600080604083850312156123995761239861216f565b5b60006123a78582860161218b565b92505060206123b885828601612216565b9150509250929050565b6000806000606084860312156123db576123da61216f565b5b60006123e98682870161218b565b93505060206123fa86828701612216565b925050604061240b86828701612216565b9150509250925092565b6000806040838503121561242c5761242b61216f565b5b600061243a85828601612216565b925050602061244b85828601612216565b9150509250929050565b60008151905061246481612174565b92915050565b6000602082840312156124805761247f61216f565b5b600061248e84828501612455565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806124de57607f821691505b6020821081036124f1576124f0612497565b5b50919050565b600060408201905061250c600083018561232b565b6125196020830184612093565b9392505050565b6125298161226b565b811461253457600080fd5b50565b60008151905061254681612520565b92915050565b6000602082840312156125625761256161216f565b5b600061257084828501612537565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006125b3826122f4565b91506125be836122f4565b9250828201905060ff8111156125d7576125d6612579565b5b92915050565b60006125e882612089565b91506125f383612089565b925082820390508181111561260b5761260a612579565b5b92915050565b7f57616974696e6720666f7220626f72726f7765722066756e6473000000000000600082015250565b6000612647601a836120c8565b915061265282612611565b602082019050919050565b600060208201905081810360008301526126768161263a565b9050919050565b7f556e66696e6973686564204465616c0000000000000000000000000000000000600082015250565b60006126b3600f836120c8565b91506126be8261267d565b602082019050919050565b600060208201905081810360008301526126e2816126a6565b9050919050565b7f466f7262696464656e0000000000000000000000000000000000000000000000600082015250565b600061271f6009836120c8565b915061272a826126e9565b602082019050919050565b6000602082019050818103600083015261274e81612712565b9050919050565b600061276082612089565b915061276b83612089565b925082820190508082111561278357612782612579565b5b92915050565b60008160011c9050919050565b6000808291508390505b60018511156127e0578086048111156127bc576127bb612579565b5b60018516156127cb5780820291505b80810290506127d985612789565b94506127a0565b94509492505050565b6000826127f957600190506128b5565b8161280757600090506128b5565b816001811461281d576002811461282757612856565b60019150506128b5565b60ff84111561283957612838612579565b5b8360020a9150848211156128505761284f612579565b5b506128b5565b5060208310610133831016604e8410600b841016171561288b5782820a90508381111561288657612885612579565b5b6128b5565b6128988484846001612796565b925090508184048111156128af576128ae612579565b5b81810290505b9392505050565b60006128c782612089565b91506128d2836122f4565b92506128ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846127e9565b905092915050565b600060608201905061291c600083018661232b565b6129296020830185612093565b6129366040830184612093565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006040820190506129826000830185612093565b61298f6020830184612093565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60006129d0826122f4565b91506129db836122f4565b9250826129eb576129ea61293e565b5b828206905092915050565b6000606082019050612a0b600083018661232b565b612a18602083018561232b565b612a256040830184612093565b94935050505056fea264697066735822122072dfb79c0145951b65766f2ffdd444fad4b1fa9eb3cf521b0b038eea1adff24864736f6c63430008180033',
  linkReferences: {},
  deployedLinkReferences: {},
};
