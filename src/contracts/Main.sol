// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 < 0.7.0;
import "./ERC20.sol";

contract main {
    // Instancia del contrato Token
    ERC20Basic private token;

    // Owner del contrato
    address public owner;

    // Direccion del Smart Contract
    address public contrato;

    // Constructor
    constructor() public {
        token = new ERC20Basic(100000);
        owner = msg.sender;
        contrato = address(this);
    }

    // Obtenemos la direccion del owner
    function getOwner() public view returns(address) {
        return owner;
    }

    // Obtenemos la direccion del contrato
    function getContract() public view returns(address){
        return contrato;
    }

    // Compramos tokens mediante: direccion de destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numTokens) public {
        token.transfer(_destinatario, _numTokens);
    }

    // Obtenemos el balance de tokens de una direccion
    function balanceDirection(address _direccion) public view returns(uint) {
        return token.balanceOf(_direccion);
    }

    // Obtenemos el balance de tokens total del smart Contract
    function balanceTotal() public view returns(uint) {
        return token.balanceOf(contrato);
    }
}