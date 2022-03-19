// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

/**
 * @title cERC20 Token
 * @dev Utilities for CompoundERC20
 */
interface CErc20 {
    function mint(uint256) external returns (uint256);
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function exchangeRateStored() external view returns (uint);
    function balanceOf(address account) external view returns (uint256);

}
