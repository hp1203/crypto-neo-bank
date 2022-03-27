// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20ToCompound is Ownable {
    
    mapping(address => address) private erc20ToCtoken;
    event CompoundTokenAdded(string name, uint32 decimal, string symbol, string icon, address token, address cToken);

    constructor() {
        erc20ToCtoken[0x60B10C134088ebD63f80766874e2Cade05fc987B] = 0xaF50a5A6Af87418DAC1F28F9797CeB3bfB62750A;
        erc20ToCtoken[0xaD6D458402F60fD3Bd25163575031ACDce07538D] = 0xbc689667C13FB2a04f09272753760E38a95B998C;
        erc20ToCtoken[0xC8F88977E21630Cf93c02D02d9E8812ff0DFC37a] = 0x65280b21167BBD059221488B7cBE759F9fB18bB5;
        erc20ToCtoken[0x65058d7081FCdC3cd8727dbb7F8F9D52CefDd291] = 0x541c9cB0E97b77F142684cc33E8AC9aC17B1990F;
        erc20ToCtoken[0xFE724a829fdF12F7012365dB98730EEe33742ea2] = 0x2973e69b20563bcc66dC63Bde153072c33eF37fe;
        erc20ToCtoken[0x6EE856Ae55B6E1A249f04cd3b947141bc146273c] = 0xF6958Cf3127e62d3EB26c79F4f45d3F3b2CcdeD4;
    }

    function getRelaventCToken(address token) public view returns(address)  {
        return erc20ToCtoken[token];
    }

    function addRelaventCtoken(string memory name, uint32 decimal, string memory symbol, string memory icon, address token, address cToken) public onlyOwner {
        erc20ToCtoken[token] = cToken;
        emit CompoundTokenAdded(name, decimal, symbol, icon, token, cToken);
    }

}
