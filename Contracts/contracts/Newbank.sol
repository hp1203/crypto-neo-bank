// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import {cETH} from "./interfaces/IcEth.sol";
import {CErc20} from "./interfaces/IcErc20.sol";

import { ERC20ToCompound } from "./ERC20ToCompound.sol";

contract Neobank is Ownable, ReentrancyGuard, ERC20ToCompound {
    uint256 totalContractBalance = 0;
    // Ropsten TestNet cETH address
    address COMPOUND_CETH_ADDRESS = 0x859e9d8a4edadfEDb5A2fF311243af80F85A91b8;
    cETH ceth = cETH(COMPOUND_CETH_ADDRESS);
    // enum AccountType {
    //     CURRENT,
    //     SAVINGS
    // }

    uint256 hashDigits = 10;
    // Equivalent to 10^8 = 8
    uint256 hashModulus = 10**hashDigits;

    struct Account {
        uint256 accountNumber;
        string metadata;
    }

    mapping(address => Account[]) userAccounts;
    mapping(uint256 => uint256) accountEthBalance;
    mapping(uint256 => uint256) accountCethBalance;
    mapping(uint256 => mapping(address => uint256)) accountERC20Balance;
    mapping(uint256 => mapping(address => uint256)) accountCompoundBalance;

    event AccountCreated(
        address _owner,
        uint256 _accountNumber,
        string _metadata
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
        CErc20 cToken = CErc20(getRelaventCToken(erc20Token));
        return
            (accountCompoundBalance[_accountNumber][getRelaventCToken(erc20Token)] *
                cToken.exchangeRateStored()) / 1e18;
    }

    function getEthBalanceWithInterest(uint256 _accountNumber)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        return
            (accountCethBalance[_accountNumber] * ceth.exchangeRateStored()) /
            1e18;
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

    // function getRedeemableCEth(uint256 ethAmount)
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     return (ethAmount * 1e18) / ceth.exchangeRateStored();
    // }

    // function getRedeemableCERC20(uint256 ethAmount, address compoundToken)
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     CErc20 cToken = CErc20(compoundToken);
    //     return (ethAmount * 1e18) / cToken.exchangeRateStored();
    // }

    /**
     *@dev Approve the swap of ERC20 tokens
     */
    // function _approveApprovedTokensToCompound(
    //     address erc20Token
    // ) internal returns (uint256) {
    //     IERC20 erc20 = IERC20(erc20Token);
    //     // Get allowed amount
    //     uint256 approvedAmountOfERC20Tokens = erc20.allowance(
    //         msg.sender,
    //         address(this)
    //     );

    //     // Transfer ERC20 to Contract
    //     erc20.transferFrom(
    //         msg.sender,
    //         address(this),
    //         approvedAmountOfERC20Tokens
    //     );

    //     // Approve the amount of tokens to compound
    //     erc20.approve(getRelaventCToken(erc20Token), approvedAmountOfERC20Tokens);

    //     return approvedAmountOfERC20Tokens;
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

        require(msg.value >= _amount, "Amount sent is less.");
        require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");

        uint256 cEthBeforeMint = ceth.balanceOf(address(this));
        // send ethers to mint()
        ceth.mint{value: msg.value}();

        uint256 cEthAfterMint = ceth.balanceOf(address(this));

        uint256 cEthUser = cEthAfterMint - cEthBeforeMint;

        accountEthBalance[_accountNumber] += msg.value;
        accountCethBalance[_accountNumber] += cEthUser;

        // userAccounts[_owner][index].balance += cEthUser;
        // userAccounts[_owner][index].ethBalance += msg.value;

        totalContractBalance += cEthUser;

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
        CErc20 cToken = CErc20(getRelaventCToken(currency));
        IERC20 erc20 = IERC20(currency);

        // require(msg.value >= _amount, "Amount sent is less.");
        // require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");

        uint256 cTokenBeforeMint = cToken.balanceOf(address(this));
        // send ethers to mint()
        // uint256 approvedAmount = _approveApprovedTokensToCompound(
        //     currency
        // );
         // Approve the amount of tokens to compound
        erc20.approve(getRelaventCToken(currency), amount);
        // // Approve the amount of tokens to Uniswap router
        // erc20.approve(cERC20, msg.value);

        cToken.mint(amount);

        uint256 cTokenAfterMint = cToken.balanceOf(address(this));

        uint256 cTokenUser = cTokenAfterMint - cTokenBeforeMint;

        accountERC20Balance[_accountNumber][currency] += amount;
        accountCompoundBalance[_accountNumber][getRelaventCToken(currency)] += cTokenUser;

        // userAccounts[_owner][index].balance += cEthUser;
        // userAccounts[_owner][index].ethBalance += msg.value;

        // totalContractBalance += cTokenUser;

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
        address payable transferTo = payable(msg.sender); // get payable to transfer towards
        ceth.redeem(accountCethBalance[_accountNumber]); // Redeem that cETH
        uint256 amountToWithdraw = getEthBalanceWithInterest(_accountNumber); // Avalaible amount of $ that can be Withdrawn
        // totalContractBalance -= userAccounts[msg.sender][index].balance;
        accountCethBalance[_accountNumber] = 0;
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

        uint256 cEthWithdrawn = _withdrawCEther(amountRequested);

        totalContractBalance -= cEthWithdrawn;
        accountCethBalance[_accountNumber] -= cEthWithdrawn;
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
        // uint cEth =  getRedeemableCEth(amountRequested);
        IERC20 erc20Token = IERC20(_erc20Token);
        for (uint256 i = 0; i < userAccounts[msg.sender].length; i++) {
            if (userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
                exists = true;
            }
        }
        require(!exists, "Account not found.");
        require(
            amountRequested <= getERC20BalanceWithInterest(_accountNumber, getRelaventCToken(_erc20Token)),
            "Your balance is smaller than the requested amount"
        );
        address payable transferTo = payable(msg.sender); // get payable to transfer to sender's address

        uint256 cErc20Withdrawn = _withdrawCERC20(amountRequested, getRelaventCToken(_erc20Token));

        totalContractBalance -= cErc20Withdrawn;
        accountCompoundBalance[_accountNumber][getRelaventCToken(_erc20Token)] -= cErc20Withdrawn;
        accountERC20Balance[_accountNumber][_erc20Token] -= amountRequested;
        // transferTo.transfer(amountRequested);
        erc20Token.transfer(transferTo, amountRequested);
        emit Erc20DepositMade(
            msg.sender,
            msg.sender,
            _accountNumber,
            _erc20Token,
            amountRequested,
            block.timestamp
        );
    }

    /**
     * @dev Redeems cETH for withdraw
     * @return Withdrawn cETH
     */
    function _withdrawCEther(uint256 _amountOfEth) internal returns (uint256) {
        uint256 cEthContractBefore = ceth.balanceOf(address(this));
        ceth.redeemUnderlying(_amountOfEth);
        uint256 cEthContractAfter = ceth.balanceOf(address(this));

        uint256 cEthWithdrawn = cEthContractBefore - cEthContractAfter;

        return cEthWithdrawn;
    }

    /**
     * @dev Redeems cETH for withdraw
     * @return Withdrawn cETH
     */
    function _withdrawCERC20(uint256 _amountOfERC20, address cERC20Token) internal returns (uint256) {
        CErc20 cToken = CErc20(cERC20Token);
        uint256 cERC20ContractBefore = cToken.balanceOf(address(this));
        cToken.redeemUnderlying(_amountOfERC20);
        uint256 cERC20ContractAfter = cToken.balanceOf(address(this));

        uint256 cERC20Withdrawn = cERC20ContractBefore - cERC20ContractAfter;

        return cERC20Withdrawn;
    }

    function getExchangeRate() internal view returns (uint256) {
        return ceth.exchangeRateStored();
    }

    function getTotalEthBalance() public view returns (uint256) {
        // return ceth.balanceOf(address(this));
        return (ceth.balanceOf(address(this)) * ceth.exchangeRateStored()) /
            1e18;
    }

    function getTotalErc20Balance(address _erc20Token) public view returns (uint256) {
        // return ceth.balanceOf(address(this));
        CErc20 cToken = CErc20(getRelaventCToken(_erc20Token));
        return (cToken.balanceOf(address(this)) * cToken.exchangeRateStored()) /
            1e18;
    }

    receive() external payable {}
}
