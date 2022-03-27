// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/INeobank.sol";

contract Payments is ReentrancyGuard, Ownable {
    INeobank neobank;

    constructor(address _neobank) {
        neobank = INeobank(_neobank);
    }

    using Counters for Counters.Counter;
    uint256 public fee = 5; // amount * 5 / 1000
    // Where to send Payments ethier Neobank Account or Wallet
    // enum PaymentLinkType {
    //     ACCOUNT,
    //     WALLET
    // }

    // enum PaymentMode {
    //     LINK,
    //     DEPOSIT
    // }

    Counters.Counter paymentLinkIds;
    Counters.Counter paymentIds;

    struct PaymentLink {
        uint256 paymentLinkId;
        string _url;
        string _type; // ACCOUNT, WALLET
        address payable receiver;
        uint256 account;
        string metadata;
    }

    struct Payment {
        uint256 paymentId;
        string mode; // LINK, DEPOSIT
        address sender;
        address receiver;
        uint256 account;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        address currency;
    }

    mapping(uint256 => PaymentLink) paymentLinks;
    mapping(uint256 => Payment) payments;
    mapping(address => uint256) userPaymentLinks;

    event PaymentMade(
        uint256 paymentId,
        string mode,
        address sender,
        address receiver,
        uint256 account,
        uint256 amount,
        uint256 fee,
        uint256 timestamp,
        address currency
    );

    event PaymentLinkCreated(
        address _owner,
        uint256 paymentLinkId,
        string _url,
        string _type,
        address receiver,
        uint256 account,
        string metadata
    );

    function calculateFee(uint256 amount) public view returns (uint256) {
        return (amount * fee) / 10000;
    }

    function createPaymentLink(
        string memory url,
        string memory _type,
        address receiver,
        uint256 account,
        string memory metadata
    ) public {
        paymentLinkIds.increment();
        uint256 currentId = paymentLinkIds.current();

        paymentLinks[currentId] = PaymentLink(
            currentId,
            url,
            _type,
            payable(receiver),
            account,
            metadata
        );
        userPaymentLinks[msg.sender] = currentId;
        emit PaymentLinkCreated(msg.sender, currentId, url, _type, receiver, account, metadata);
    }

    function getPaymentLink(uint256 paymentLink)
        public
        view
        returns (PaymentLink memory)
    {
        return paymentLinks[paymentLink];
    }

    function makeEthPayment(uint256 paymentLinkId) public payable nonReentrant {
        paymentIds.increment();
        uint256 currentId = paymentIds.current();
        PaymentLink memory paymentLink = paymentLinks[paymentLinkId];
        address payable transferTo = payable(paymentLink.receiver);
        uint256 txFee = calculateFee(msg.value);
        uint256 sendingAmount = msg.value - txFee;

        if (keccak256(bytes(paymentLink._type)) == keccak256(bytes('WALLET'))) {
            transferTo.transfer(sendingAmount);
        } else {
            neobank.depositIntoAccount{value: sendingAmount}(
                paymentLink.receiver,
                paymentLink.account,
                sendingAmount
            );
        }

        payments[currentId] = Payment(
            currentId,
            'LINK',
            msg.sender,
            paymentLink.receiver,
            paymentLink.account,
            msg.value,
            txFee,
            block.timestamp,
            address(0)
        );
        emit PaymentMade(
            currentId,
            'LINK',
            msg.sender,
            paymentLink.receiver,
            paymentLink.account,
            msg.value,
            txFee,
            block.timestamp,
            address(0)
        );
    }

    function makeERC20Payment(uint256 paymentLinkId, address currency)
        public
        payable
        nonReentrant
    {
        paymentIds.increment();
        uint256 currentId = paymentIds.current();
        IERC20 erc20 = IERC20(currency);
        PaymentLink memory paymentLink = paymentLinks[paymentLinkId];
        address payable transferTo = payable(paymentLink.receiver);
        uint256 txFee = calculateFee(msg.value);
        uint256 sendingAmount = msg.value - txFee;

        if (keccak256(bytes(paymentLink._type)) == keccak256(bytes('WALLET'))) {
            // erc20.transfer(sendingAmount);
            erc20.transfer(transferTo, sendingAmount);
        } else {
            neobank.depositERC20IntoAccount(
                paymentLink.receiver,
                paymentLink.account,
                sendingAmount,
                currency
            );
        }
        transferTo.transfer(sendingAmount);
        payments[currentId] = Payment(
            currentId,
            'LINK',
            msg.sender,
            paymentLink.receiver,
            paymentLink.account,
            msg.value,
            txFee,
            block.timestamp,
            address(0)
        );
        emit PaymentMade(
            currentId,
            'LINK',
            msg.sender,
            paymentLink.receiver,
            paymentLink.account,
            msg.value,
            txFee,
            block.timestamp,
            address(0)
        );
    }
}
