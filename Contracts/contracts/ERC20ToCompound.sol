// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20ToCompound is Ownable {
    
    mapping(address => address) private erc20ToCtoken;
    event CompoundTokenAdded(string name, uint32 decimal, string symbol, string icon, address token, address cToken);

    constructor() {

    }

    function getRelaventCToken(address token) public view returns(address) {
        return erc20ToCtoken[token];
    }

    function addRelaventCtoken(string memory name, uint32 decimal, string memory symbol, string memory icon, address token, address cToken) public onlyOwner {
        erc20ToCtoken[token] = cToken;
        emit CompoundTokenAdded(name, decimal, symbol, icon, token, cToken);
    }

}
