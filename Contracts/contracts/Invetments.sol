// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/INeobank.sol";

import {cETH} from "./interfaces/IcEth.sol";
import {CErc20} from "./interfaces/IcErc20.sol";

contract Investments is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter fdIds;
    Counters.Counter rdIds;

    address COMPOUND_CETH_ADDRESS = 0x859e9d8a4edadfEDb5A2fF311243af80F85A91b8;
    cETH ceth = cETH(COMPOUND_CETH_ADDRESS);

    // uint256 public fee = 5; // amount * 5 / 1000
    struct FD {
        uint256 fdId;
        address payable owner;
        string name;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
        uint256 redeemedAmount;
        address currency;
        uint256 cTokens;
        bool isActive;
    }
    struct RD {
        uint256 rdId;
        address payable owner;
        string name;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
        uint256 redeemedAmount;
        uint256 frequency;
        address currency;
        uint256 cTokens;
        bool isActive;
    }

    event FdRedeemd(
        uint256 fdId,
        uint256 redeemedAmount
    );

    event FdCreated(
        uint256 fdId,
        address owner,
        string name,
        uint256 startDate,
        uint256 endDate,
        uint256 amount,
        uint256 redeemedAmount,
        address currency,
        uint256 cTokens,
        bool isActive
    );

     event RdCreated (
        uint256 rdId,
        address owner,
        string name,
        uint256 startDate,
        uint256 endDate,
        uint256 amount,
        uint256 redeemedAmount,
        uint256 frequency,
        address currency,
        uint256 cTokens,
        bool isActive
     );

    mapping(uint => FD) Fds;
    mapping(address => uint) usersFds;
    mapping(uint => RD) Rds;
    mapping(address => uint) usersRds;

    function makeFd(string memory _name, uint256 duration) public payable {
       require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");
       fdIds.increment();
       uint currentId = fdIds.current();
       uint256 startDate = block.timestamp;
       uint256 endDate = block.timestamp + duration * 1 days;

        uint256 cEthBeforeMint = ceth.balanceOf(address(this));
        // send ethers to mint()
        ceth.mint{value: msg.value}();

        uint256 cEthAfterMint = ceth.balanceOf(address(this));

        uint256 cEthUser = cEthAfterMint - cEthBeforeMint;

       Fds[currentId] = FD(currentId, payable(msg.sender), _name, startDate, endDate, msg.value, 0, address(0), cEthUser, true); 
       usersFds[msg.sender] = currentId;

       emit FdCreated(currentId, msg.sender, _name, startDate, endDate, msg.value, 0, address(0), cEthUser, true); 
    }

    function getFdBalanceWithInterest(uint256 fdId)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        
        return
            (Fds[fdId].cTokens * ceth.exchangeRateStored()) /
            1e18;
    }

    function getFdBalance(uint256 fdId)
        public
        view
        returns (uint256)
    {
        // Get amount of cETH and calculate received ETH based on the exchange rate
        // Account memory account = getAccountDetails(_owner, _accountNumber);
        return Fds[fdId].amount;
    }

    function redeemFd(uint256 fdId) public nonReentrant {
        FD storage fd = Fds[fdId];
        require(msg.sender == fd.owner, "You are not owner");

        address payable transferTo = payable(fd.owner); // get payable to transfer towards
        ceth.redeem(fd.cTokens); // Redeem that cETH
        uint256 amountToWithdraw = getFdBalanceWithInterest(fd.cTokens); // Avalaible amount of $ that can be Withdrawn
        // totalContractBalance -= userAccounts[msg.sender][index].balance;
        fd.cTokens = 0;
        fd.isActive = false;
        transferTo.transfer(amountToWithdraw);
        emit FdRedeemd(fdId, amountToWithdraw);
    }

    function makeRd(string memory _name, uint256 startDate, uint256 endDate, uint256 frequency) public payable {
       require(msg.value >= 0.01 ether, "Minimum deposit amount is 0.01 Eth");
       rdIds.increment();
       uint currentId = rdIds.current();

        uint256 cEthBeforeMint = ceth.balanceOf(address(this));
        // send ethers to mint()
        ceth.mint{value: msg.value}();

        uint256 cEthAfterMint = ceth.balanceOf(address(this));

        uint256 cEthUser = cEthAfterMint - cEthBeforeMint;

       Rds[currentId] = RD(currentId, payable(msg.sender), _name, startDate, endDate, 0, 0, frequency, address(0), cEthUser, true); 
       usersRds[msg.sender] = currentId;

       emit RdCreated(currentId, msg.sender, _name, startDate, endDate, 0, 0, frequency, address(0), cEthUser, true); 
    }

    function redeemMaturedFds() public {
        for(uint i = 1; i <= fdIds.current(); i++){
            if(Fds[i].endDate <= block.timestamp){
                redeemFd(i);
            }
        }
    }
}