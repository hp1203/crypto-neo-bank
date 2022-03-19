// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

/**
 * @title Uniswap Router
 * @dev Allows converting tokens 
 */
interface UniswapRouter {
    function WETH() external pure returns (address);
    
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function swapExactETHForTokens(
        uint amountOutMin, 
        address[] calldata path, 
        address to, 
        uint deadline
    )  external  payable  returns (uint[] memory amounts);

    function getAmountsIn(uint amountOut, address[] memory path)
        view
        external
        returns (uint[] memory amounts);

}