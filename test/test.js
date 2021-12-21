const { assert } = require("chai");

// Llamada al contrato 'Main'
const Main = artifacts.require('Main');

contract('Main', accounts => {
    it('Funcion: getOwner()', async() => {
        // Smart contract desplegado
        let instance = await Main.deployed();


        const direccionOwner = await instance.getOwner.call();
        console.log('Accounts[0]: ', accounts[0]);
        console.log('Direccion del Owner ', direccionOwner);
        assert.equal(accounts[0], direccionOwner);
    });

    it('Funcion: sendTokens(address _destinatario, uint _numTokens)', async() => {
        // Smart contract desplegado
        let instance = await Main.deployed();

        inicial_balance_direccion = await instance.balanceDirection.call(accounts[0]);
        inicial_balance_contrato = await instance.balanceTotal.call();

        console.log('Balance Inicial de accounts[0]: ', inicial_balance_direccion);
        console.log('Balance Total Inicial del Smart Contract: ', inicial_balance_contrato);

        // Envio de tokens
        await instance.sendTokens(accounts[0], 10, {from: accounts[0]});

        balance_direccion = await instance.balanceDirection.call(accounts[0]);
        balance_contrato = await instance.balanceTotal.call();

        console.log('Balance de accounts[0]: ', balance_direccion);
        console.log('Balance Total del Smart Contract ', balance_contrato);

        // Verificaciones
        assert.equal(balance_direccion, 10);
        assert.equal(balance_direccion, parseInt(inicial_balance_direccion)+10);
        assert.equal(balance_contrato, parseInt(inicial_balance_contrato)-10);
    });
});