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

    // Establecer el precio de un token
    function tokenPrice(uint _numTokens) internal pure returns(uint) {
        // Conversion de tokens a ethers: 1 token -> 1 Ether
        return _numTokens*(1 ether);
    }

    // Compramos tokens mediante: direccion de destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numTokens) public payable {
        // Fitlrar el número de tokens a comprar
        require(_numTokens <= 10, "La cantidad de tokens es demasiado alta.");

        // Establecer un precio
        uint costo = tokenPrice(_numTokens);
        // Se evalua la cantidad de tokens que tiene el cliente
        require(msg.value >= costo, "Compra menos tokens o paga con mas ethers");
        // Diferencia de lo que el cliente paga
        uint returnValue = msg.value - costo;

        // Retorna la cantidad de tokens determinada
        msg.sender.transfer(returnValue);

        // Obtener el balance de tokens disponibles
        uint Balance = balanceTotal();
        require(_numTokens <= Balance, "Compra un número menor de tokens");

        // Transferencia de los tokens al destinatario
        token.transfer(_destinatario, _numTokens);
    }

    // Generacion de tokens al contrato
    function generateTokens(uint _numTokens) public onlyByOwner(){
        token.increaseTotalSupply(_numTokens);
    }

    // Modificador que permita la ejecucion solo por el owner
    modifier onlyByOwner() {
        require(msg.sender == owner, "No tienes permisos para esta función");
        _;
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