// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

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