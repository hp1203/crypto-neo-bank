// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

/**
 * @title Neobank Interface
 * @dev Utilities for Neobank
 */
interface INeobank {
    //@dev functions from Neobank that are going to be used
    function depositIntoAccount(
        address _owner,
        uint256 _accountNumber,
        uint256 _amount
    ) external payable;

    function depositERC20IntoAccount(
        address _owner,
        uint256 _accountNumber,
        uint256 _amount,
        address currency
    ) external payable;
}
