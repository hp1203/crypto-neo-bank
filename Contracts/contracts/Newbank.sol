// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title cETH Token
 * @dev Utilities for CompoundETH
 */
interface cETH {
    //@dev functions from Compound that are going to be used
    function mint() external payable; // to deposit to Compound
    function redeem(uint redeemTokens) external returns (uint); // Redeem ETH from Compound
    function redeemUnderlying(uint redeemAmount) external returns (uint); // Redeem specified Amount
    // These 2 determine the amount you're able to withdraw
    function exchangeRateStored() external view returns (uint);
    function balanceOf(address owner) external view returns (uint256 balance);
}

contract Neobank is Ownable {

    uint totalContractBalance = 0;
    // Ropsten TestNet cETH address
    address COMPOUND_CETH_ADDRESS = 0x859e9d8a4edadfEDb5A2fF311243af80F85A91b8;
    cETH ceth = cETH(COMPOUND_CETH_ADDRESS);
    // enum AccountType {
    //     CURRENT,
    //     SAVINGS
    // }
    uint hashDigits = 10;
	
	// Equivalent to 10^8 = 8
	uint hashModulus = 10 ** hashDigits;

    struct Account {
        uint accountNumber;
        string metadata;
        uint ethBalance;
        uint balance;
    }

    event AccountCreated(address _owner, uint _accountNumber, string _metadata);
    event DepositMade(address _depositor, address _owner, uint _accountNumber, uint _amount, uint _timestamp);
    
    mapping(address => Account[]) public userAccounts;

    function getContractBalance() public view returns(uint) {
        return totalContractBalance;
    }

    // Function to generate the hash value
	function _generateAccountNumber(string memory _str)
		internal view returns (uint)
	{
		uint random =
			uint(keccak256(abi.encodePacked(msg.sender, _str, block.timestamp)));
			
		// Returning the generated hash value
		return random % hashModulus;
	}

    function createAccount(string memory _name, string memory _metadata) external {
        uint accountNum = _generateAccountNumber(_name);
        userAccounts[msg.sender].push(Account(accountNum, _metadata, 0, 0));
    }

    function myAccounts() public view returns(Account[] memory) {
        return userAccounts[msg.sender];
    }

    function getAccountDetails(address _owner, uint _accountNumber) public view returns(Account memory) {
        Account[] memory accounts = userAccounts[_owner];
        Account memory userAccount;
        for(uint i = 0; i < accounts.length; i++) {
            if(accounts[i].accountNumber == _accountNumber) {
                userAccount = accounts[i];
            }
        }
        return userAccount;
    }

    /**
    * @dev Retrieves the amount of stored Ether
    */
    function getInterestEarned(address _owner, uint _accountNumber) public view returns(uint) {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        Account memory account = getAccountDetails(_owner, _accountNumber);
        return account.balance*ceth.exchangeRateStored()/1e18;
        
    }

    function depositIntoAccount(address _owner, uint _accountNumber, uint _amount) public payable {

        uint index = 0;
        for(uint i = 0; i < userAccounts[_owner].length; i++) {
            if(userAccounts[_owner][i].accountNumber == _accountNumber) {
                index = i;
            }
        }
        // Account userAccount = getAccountDetails(_owner, _accountNumber);

        require(msg.value >= _amount, "Amount sent is less.");
        require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");

        uint256 cEthBeforeMint = ceth.balanceOf(address(this));
        // send ethers to mint()
        ceth.mint{value: msg.value}();
        
        uint256 cEthAfterMint = ceth.balanceOf(address(this));
        
        uint cEthUser = cEthAfterMint - cEthBeforeMint;

        userAccounts[_owner][index].balance += cEthUser;

        userAccounts[_owner][index].ethBalance += msg.value;

        totalContractBalance += cEthUser;

        emit DepositMade(msg.sender, _owner, _accountNumber, cEthUser, block.timestamp);
    }

    /**
    * @dev Withdraws all the Ether
    */
    function withdrawMax(uint _accountNumber) public payable {
        uint index = 0;
        for(uint i = 0; i < userAccounts[msg.sender].length; i++) {
            if(userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
            }
        }
        address payable transferTo = payable(msg.sender); // get payable to transfer towards
        ceth.redeem(userAccounts[msg.sender][index].balance); // Redeem that cETH
        uint256 amountToWithdraw = userAccounts[msg.sender][index].balance; // Avalaible amount of $ that can be Withdrawn
        totalContractBalance -= userAccounts[msg.sender][index].balance;
        userAccounts[msg.sender][index].balance = 0;
        userAccounts[msg.sender][index].ethBalance = 0;
        transferTo.transfer(amountToWithdraw);
    }

    /**
    * @dev Withdraw a specific amount of Ether
    */
    function withdrawAmount(uint amountRequested, uint _accountNumber) public payable {
        uint index = 0;
        for(uint i = 0; i < userAccounts[msg.sender].length; i++) {
            if(userAccounts[msg.sender][i].accountNumber == _accountNumber) {
                index = i;
            }
        }
        require(amountRequested <= userAccounts[msg.sender][index].ethBalance, "Your balance is smaller than the requested amount");
        address payable transferTo = payable(msg.sender); // get payable to transfer to sender's address
        
        uint256 cEthWithdrawn = _withdrawCEther(amountRequested);

        totalContractBalance -= cEthWithdrawn;
        userAccounts[msg.sender][index].balance -= cEthWithdrawn;
        userAccounts[msg.sender][index].ethBalance = amountRequested;
        transferTo.transfer(amountRequested);
        
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

    function getExchangeRate() public view returns(uint256){
        return ceth.exchangeRateStored();
    }

    function getTotalBalance() public view returns(uint) {
        return totalContractBalance;
    }

    receive() external payable{}
}
