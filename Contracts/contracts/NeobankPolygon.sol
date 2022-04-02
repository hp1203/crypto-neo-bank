// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {cETH} from "./interfaces/IcEth.sol";
import {CErc20} from "./interfaces/IcErc20.sol";

import { ERC20ToAtoken } from "./ERC20ToAtoken.sol";
import { ILendingPoolAddressesProvider } from "./interfaces/ILendingPoolAddressesProvider.sol";
import { IWETHGateway } from "./interfaces/IWETHGateway.sol";
import { IAToken } from "./interfaces/AToken/IAToken.sol";
import { ILendingPool } from "./interfaces/ILendingPool.sol";

contract NeobankPolygon is Ownable, ReentrancyGuard, ERC20ToAtoken {

    ILendingPoolAddressesProvider addressProvider = ILendingPoolAddressesProvider(0x178113104fEcbcD7fF8669a0150721e231F0FD4B);
    IWETHGateway WethGateway = IWETHGateway(0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA);
    IAToken WMatic = IAToken(0xF45444171435d0aCB08a8af493837eF18e86EE27);

    uint256 totalContractBalance = 0;
    mapping(address => uint) totalER20ContractBalance;

    uint256 hashDigits = 10;
    // Equivalent to 10^8 = 8
    uint256 hashModulus = 10**hashDigits;

    struct Account {
        uint256 accountNumber;
        string metadata;
    }

    mapping(address => Account[]) userAccounts;
    mapping(uint256 => uint256) accountEthBalance;
    mapping(uint256 => uint256) accountAethBalance;
    mapping(uint256 => mapping(address => uint256)) accountERC20Balance;
    mapping(uint256 => mapping(address => uint256)) accountCompoundBalance;

    event AccountCreated(
        address _owner,
        uint256 _accountNumber,
        string _metadata
    );
    event EthTransferMade(
        address _depositor,
        uint256 _depositorAccount,
        address _receiver,
        uint256 _receiverAccount,
        uint256 _amount,
        uint256 _timestamp
    );
    event EthDepositMade(
        address _depositor,
        address _owner,
        uint256 _accountNumber,
        uint256 _amount,
        uint256 _timestamp
    );
    event EthWithdrawMade(
        address _withdrawer,
        address _owner,
        uint256 _accountNumber,
        uint256 _amount,
        uint256 _timestamp
    );
    event Erc20DepositMade(
        address _depositor,
        address _owner,
        uint256 _accountNumber,
        address currency,
        uint256 _amount,
        uint256 _timestamp
    );
    event Erc20WithdrawMade(
        address _withdrawer,
        address _owner,
        uint256 _accountNumber,
        address currency,
        uint256 _amount,
        uint256 _timestamp
    );

    // mapping(address => Account[]) public userAccounts;

    function getContractBalance() public view returns (uint256) {
        return totalContractBalance;
    }

    // Function to generate the hash value
    function _generateAccountNumber(string memory _str)
        internal
        view
        returns (uint256)
    {
        uint256 random = uint256(
            keccak256(abi.encodePacked(msg.sender, _str, block.timestamp))
        );

        // Returning the generated hash value
        return random % hashModulus;
    }

    function createAccount(string memory _name, string memory _metadata)
        external
    {
        uint256 accountNum = _generateAccountNumber(_name);
        userAccounts[msg.sender].push(Account(accountNum, _metadata));
        accountEthBalance[accountNum] = 0;
        // accountERC20Balance[accountNum] = 0;
    }

    function myAccounts() public view returns (Account[] memory) {
        return userAccounts[msg.sender];
    }

    function getAccountDetails(address _owner, uint256 _accountNumber)
        public
        view
        returns (Account memory)
    {
        Account[] memory accounts = userAccounts[_owner];
        Account memory userAccount;
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i].accountNumber == _accountNumber) {
                userAccount = accounts[i];
            }
        }
        return userAccount;
    }

    /**
     * @dev Retrieves the amount of stored Ether
     */
    function getERC20BalanceWithInterest(
        uint256 _accountNumber,
        address erc20Token
    ) public view returns (uint256) {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        IAToken aToken = IAToken(getRelaventAToken(erc20Token));
         uint totalScaledBalance = aToken.scaledBalanceOf(address(this));
        uint currentLiquidityIndex = totalScaledBalance / totalER20ContractBalance[getRelaventAToken(erc20Token)];
        return
            accountCompoundBalance[_accountNumber][getRelaventAToken(erc20Token)] / currentLiquidityIndex;
    }

    function getEthBalanceWithInterest(uint256 _accountNumber)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        uint totalScaledBalance = WMatic.scaledBalanceOf(address(this));
        uint currentLiquidityIndex = totalScaledBalance / totalContractBalance;

        return
            accountAethBalance[_accountNumber] * currentLiquidityIndex;
    }

    function getERC20Balance(uint256 _accountNumber, address currency)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        return accountERC20Balance[_accountNumber][currency];
    }

    function getEthBalance(uint256 _accountNumber)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        return accountEthBalance[_accountNumber];
    }

    // function transferETH(uint256 _fromAccount, uint256 _toAccount, address receiver, uint256 amount) external {
        
    //     require(accountEthBalance[_fromAccount] >= amount, "Low Balance");
        
    //     uint cethUnderlying = (amount / ceth.exchangeRateStored()) * 1e18;

    //     accountEthBalance[_fromAccount] -= amount;
    //     accountAethBalance[_fromAccount] -= cethUnderlying;

    //     accountEthBalance[_toAccount] += amount;
    //     accountAethBalance[_toAccount] += cethUnderlying;

    //     emit EthTransferMade(msg.sender, _fromAccount, receiver, _toAccount, amount, block.timestamp);
    // }

    function depositIntoAccount(
        address _owner,
        uint256 _accountNumber,
        uint256 _amount
    ) external payable {
        // uint index = 0;
        // for(uint i = 0; i < userAccounts[_owner].length; i++) {
        //     if(userAccounts[_owner][i].accountNumber == _accountNumber) {
        //         index = i;
        //     }
        // }
        // // Account userAccount = getAccountDetails(_owner, _accountNumber);
        address poolAddress = addressProvider.getLendingPool(); 
        // ILendingPool lendingPool = ILendingPool(poolAddress);

        require(msg.value >= _amount, "Amount sent is less.");
        require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");

        uint256 aEthBeforeMint = WMatic.balanceOf(address(this));
        // send ethers to mint()
        // WMatic.mint{value: msg.value}();
        WethGateway.depositETH{value: msg.value}(poolAddress, address(this), 0);

        uint256 aEthAfterMint = WMatic.balanceOf(address(this));

        uint256 aEthUser = aEthAfterMint - aEthBeforeMint;

        accountEthBalance[_accountNumber] += msg.value;
        accountAethBalance[_accountNumber] += aEthUser;

        // userAccounts[_owner][index].balance += aEthUser;
        // userAccounts[_owner][index].ethBalance += msg.value;

        totalContractBalance += msg.value;

        emit EthDepositMade(
            msg.sender,
            _owner,
            _accountNumber,
            msg.value,
            block.timestamp
        );
    }

    function depositERC20IntoAccount(
        address _owner,
        uint256 _accountNumber,
        uint256 amount,
        address currency
    ) external payable {
        IAToken aToken = IAToken(getRelaventAToken(currency));
        IERC20 erc20 = IERC20(currency);

        address poolAddress = addressProvider.getLendingPool(); 
        ILendingPool lendingPool = ILendingPool(poolAddress);
        // require(msg.value >= _amount, "Amount sent is less.");
        // require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");

        uint256 aTokenBeforeMint = aToken.balanceOf(address(this));
        // send ethers to mint()
        // uint256 approvedAmount = _approveApprovedTokensToCompound(
        //     currency
        // );
         // Approve the amount of tokens to compound
        erc20.approve(getRelaventAToken(currency), amount);
        // // Approve the amount of tokens to Uniswap router
        // erc20.approve(cERC20, msg.value);

        // aToken.mint(amount);
        lendingPool.deposit(getRelaventAToken(currency), amount, address(this), 0);

        uint256 aTokenAfterMint = aToken.balanceOf(address(this));

        uint256 aTokenUser = aTokenAfterMint - aTokenBeforeMint;

        accountERC20Balance[_accountNumber][currency] += amount;
        accountCompoundBalance[_accountNumber][getRelaventAToken(currency)] += aTokenUser;

        // userAccounts[_owner][index].balance += cEthUser;
        // userAccounts[_owner][index].ethBalance += msg.value;

        // totalContractBalance += cTokenUser;
        totalER20ContractBalance[getRelaventAToken(currency)] += amount;

        emit Erc20DepositMade(
            msg.sender,
            _owner,
            _accountNumber,
            currency,
            amount,
            block.timestamp
        );
    }

    /**
     * @dev Withdraws all the Ether
     */
    function withdrawMaxEth(uint256 _accountNumber) public nonReentrant {
        uint256 index = 0;
        bool exists = false;
        for (uint256 i = 0; i < userAccounts[msg.sender].length; i++) {
            if (userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
                exists = true;
            }
        }
        require(exists, "Account not found.");
        
        address poolAddress = addressProvider.getLendingPool(); 
        ILendingPool lendingPool = ILendingPool(poolAddress);

        address payable transferTo = payable(msg.sender); // get payable to transfer towards
        // .redeem(accountAethBalance[_accountNumber]); // Redeem that cETH
        lendingPool.withdraw(0xF45444171435d0aCB08a8af493837eF18e86EE27, accountAethBalance[_accountNumber], address(this));
        uint256 amountToWithdraw = getEthBalanceWithInterest(_accountNumber); // Avalaible amount of $ that can be Withdrawn
        // totalContractBalance -= userAccounts[msg.sender][index].balance;
        accountAethBalance[_accountNumber] = 0;
        accountEthBalance[_accountNumber] = 0;
        transferTo.transfer(amountToWithdraw);
        emit EthWithdrawMade(
            msg.sender,
            msg.sender,
            _accountNumber,
            amountToWithdraw,
            block.timestamp
        );
    }

    /**
     * @dev Withdraw a specific amount of Ether
     */
    function withdrawAmountEth(uint256 amountRequested, uint256 _accountNumber)
        public nonReentrant
    {
        uint256 index = 0;
        bool exists = false;
        // uint cEth =  getRedeemableCEth(amountRequested);

        address poolAddress = addressProvider.getLendingPool(); 
        ILendingPool lendingPool = ILendingPool(poolAddress);

        for (uint256 i = 0; i < userAccounts[msg.sender].length; i++) {
            if (userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
                exists = true;
            }
        }
        require(!exists, "Account not found.");
        require(
            amountRequested <= getEthBalanceWithInterest(_accountNumber),
            "Your balance is lower than the requested amount"
        );
        address payable transferTo = payable(msg.sender); // get payable to transfer to sender's address
        // uint256 cEthWithdrawn = _withdrawCEther(amountRequested);

        uint256 aEthBeforeWithdraw = WMatic.balanceOf(address(this));

        lendingPool.withdraw(0xF45444171435d0aCB08a8af493837eF18e86EE27, amountRequested, address(this));
        // send ethers to mint()
        // WMatic.mint{value: msg.value}();
        // WethGateway.depositETH{value: msg.sender}(poolAddress, address(this), 0);

        uint256 aEthAfterWithdraw = WMatic.balanceOf(address(this));

        uint256 aEthUser = aEthAfterWithdraw - aEthBeforeWithdraw;

        totalContractBalance -= aEthUser;
        accountAethBalance[_accountNumber] -= aEthUser;
        accountEthBalance[_accountNumber] -= amountRequested;
        transferTo.transfer(amountRequested);
        emit EthWithdrawMade(
            msg.sender,
            msg.sender,
            _accountNumber,
            amountRequested,
            block.timestamp
        );

    }

    /**
     * @dev Withdraw a specific amount of ERC20 Token
     */
    function withdrawAmountErc20(uint256 amountRequested, uint256 _accountNumber, address _erc20Token)
        public
        nonReentrant
    {
        uint256 index = 0;
        bool exists = false;
        uint256 amount = amountRequested;
        // uint cEth =  getRedeemableCEth(amountRequested);
        IERC20 erc20Token = IERC20(_erc20Token);
        address poolAddress = addressProvider.getLendingPool(); 
        ILendingPool lendingPool = ILendingPool(poolAddress);
        IAToken aToken = IAToken(getRelaventAToken(_erc20Token));

        for (uint256 i = 0; i < userAccounts[msg.sender].length; i++) {
            if (userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
                exists = true;
            }
        }
        require(!exists, "Account not found.");
        require(
            amountRequested <= getERC20BalanceWithInterest(_accountNumber, getRelaventAToken(_erc20Token)),
            "Your balance is smaller than the requested amount"
        );
        address payable transferTo = payable(msg.sender); // get payable to transfer to sender's address

        uint256 aERC20BeforeWithdraw = aToken.balanceOf(address(this));

        lendingPool.withdraw(getRelaventAToken(_erc20Token), amountRequested, address(this));
        // send ethers to mint()
        // aToken.mint{value: msg.value}();
        // WethGateway.depositETH{value: msg.sender}(poolAddress, address(this), 0);

        uint256 aERC20AfterWithdraw = aToken.balanceOf(address(this));

        uint256 aERC20User = aERC20AfterWithdraw - aERC20BeforeWithdraw;

        // uint256 cErc20Withdrawn = _withdrawCERC20(amountRequested, getRelaventAToken(_erc20Token));

        totalER20ContractBalance[getRelaventAToken(_erc20Token)] -= aERC20User;
        accountCompoundBalance[_accountNumber][getRelaventAToken(_erc20Token)] -= aERC20User;
        accountERC20Balance[_accountNumber][_erc20Token] -= amountRequested;
        // transferTo.transfer(amountRequested);
        erc20Token.transfer(transferTo, amount);

        emit Erc20DepositMade(
            msg.sender,
            msg.sender,
            _accountNumber,
            _erc20Token,
            amount,
            block.timestamp
        );
    }

    /**
     * @dev Redeems cETH for withdraw
     * @return Withdrawn cETH
     */
    // function _withdrawCEther(uint256 _amountOfEth) internal returns (uint256) {
    //     uint256 cEthContractBefore = ceth.balanceOf(address(this));
    //     ceth.redeemUnderlying(_amountOfEth);
    //     uint256 cEthContractAfter = ceth.balanceOf(address(this));

    //     uint256 cEthWithdrawn = cEthContractBefore - cEthContractAfter;

    //     return cEthWithdrawn;
    // }

    /**
     * @dev Redeems cETH for withdraw
     * @return Withdrawn cETH
     */
    // function _withdrawCERC20(uint256 _amountOfERC20, address cERC20Token) internal returns (uint256) {
    //     CErc20 cToken = CErc20(cERC20Token);
    //     uint256 cERC20ContractBefore = cToken.balanceOf(address(this));
    //     cToken.redeemUnderlying(_amountOfERC20);
    //     uint256 cERC20ContractAfter = cToken.balanceOf(address(this));

    //     uint256 cERC20Withdrawn = cERC20ContractBefore - cERC20ContractAfter;

    //     return cERC20Withdrawn;
    // }

    // function getExchangeRate() internal view returns (uint256) {
    //     return ceth.exchangeRateStored();
    // }

    function getTotalEthBalance() public view returns (uint256) {
        // return ceth.balanceOf(address(this));
        return WMatic.scaledBalanceOf(address(this));
    }

    function getTotalErc20Balance(address _erc20Token) public view returns (uint256) {
        // return ceth.balanceOf(address(this));
        CErc20 cToken = CErc20(getRelaventAToken(_erc20Token));
        return (cToken.balanceOf(address(this)) * cToken.exchangeRateStored()) /
            1e18;
    }

    receive() external payable {}
}
