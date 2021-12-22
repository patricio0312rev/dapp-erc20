import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import web3 from '../ethereum/web3';
import contratoToken from '../abis/main.json';

class App extends Component {
  async componentWillMount() {
    // Carga de Web3
    await this.loadWeb3();
    // Carga de datos de la Blockchain
    await this.loadBlockchainData();
  }

  // Carga de Web3
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3 (window.ethereum);
      await window.ethereum.enable()
    } else if(window.web3) {
      window.web3 = new Web3 (window.web3.currentProvider);
    } else {
      window.alert('Non ethereum browser detected. You should consider trying Metamask!');
    }
  }

  // Cara de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3;
    // Carga de la cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    console.log('account: ', this.state.account);
    
    const networkId = '4'; // Rinkeby: 4 | Ganache: 5777
    console.log('networkId: ', networkId);
    const networkData = contratoToken.networks[networkId];
    console.log('networkData:', networkData);

    if(networkData) {
      const abi = contratoToken.abi;
      console.log('abi', abi);
      const address = networkData.address;
      console.log('address', address);
      const contract = new web3.eth.Contract(abi, address);
      this.setState({contract});
      console.log(contract)

      // Direccion del Smart Contract
      const smartContract = await this.state.contract.methods.getContract().call();
      this.setState({smartContractAdress: smartContract})
      console.log('Smart Contract Address: ', smartContract);
    } else {
      window.alert('¡El Smart Contract no se ha desplegado en la red!');
    }
  }

  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      smartContractAdress: '',
      owner: '',
      address: '',
      quantity: 0,
      loading: false,
      errorMessage: '',
      addressBalance: '',
      numTokens: 0,
    }
  }

  // Función para realizar la compra de tokens
  envio = async(address, quantity, ethers, message) => {
    try {
      console.log(message);
      const accounts = await web3.eth.getAccounts();
      await this.state.contract.methods.sendTokens(address, quantity).send({from: accounts[0], value: ethers});
    } catch(err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false});
    }
  }

  // Funcion para visualizar el balance de tokens de un usuario
  balance_persona = async(balanceAddress, message) => {
    try {
      console.log(message);
      // Balance de la persona
      const balance_direccion = await this.state.contract.methods.balanceDirection(balanceAddress).call();
      alert(parseFloat(balance_direccion));
      this.setState({addressBalance: balance_direccion});
      
    } catch(err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false});
    }
  }

  // Funcion para visualizar el balance de tokens del Smart Contract
  balance_contrato = async(message) => {
    try {
      console.log(message);
      // Balance del smart contract
      const balance = await this.state.contract.methods.balanceTotal().call();
      alert(parseFloat(balance));
    } catch(err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false});
    }
  }

  // Funcion para incrementar el número de tokens del Smart Contract
  incremento_tokens = async(quantity, message) => {
    try {
      console.log(message);
      const accounts = await web3.eth.getAccounts();
      // Incrementar el balance de tokens del Smart Contract
      await this.state.contract.methods.generateTokens(quantity).send({from: accounts[0]});
    } catch(err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false});
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp de Patricio
          </a>

          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
              <small className='text-white'><span id="account">{this.state.smartContractAdress}</span></small>
            </li>
          </ul>
        </nav>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Comprar tokens ERC-20</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const address = this.address.value;
                  const quantity = this.quantity.value;
                  const ethers = web3.utils.toWei(this.quantity.value, 'ether');
                  const message = 'Compra de tokens en ejecución...';
                  this.envio(address, quantity, ethers, message);
                }}>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Dirección de destino'
                    ref={(input) => {this.address = input}}/>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Cantidad de tokens a comprar (1 token = 1 Ether)'
                    ref={(input) => {this.quantity = input}}/>
                  
                  <input 
                    type="submit" 
                    className='btn btn-block btn-danger btn-sm' 
                    value='Comprar tokens'/>

                </form>

                &nbsp;

                <h1>Balance total de tokens de un usuario</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const balanceAddress = this.balanceAddress.value;
                  const message = 'Balance de tokens de un usuario en ejecución...';
                  this.balance_persona(balanceAddress, message);
                }}>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Dirección de usuario'
                    ref={(input) => {this.balanceAddress = input}}/>
                  
                  <input 
                    type="submit" 
                    className='btn btn-block btn-success btn-sm' 
                    value='Obtener balance'/>

                </form>

                &nbsp;

                <h1>Balance de tokens del Smart Contract</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const message = 'Balance de tokens del Smart Contract en ejecución...';
                  this.balance_contrato(message);
                }}>
                  <input 
                    type="submit" 
                    className='btn btn-block btn-primary btn-sm' 
                    value='Obtener balance total'/>

                </form>

                &nbsp;

                <h1>Añadir nuevos tokens</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const message = 'Incremento de tokens del Smart Contract en ejecución...';
                  const quantity = this.quantity.value; 
                  this.incremento_tokens(quantity, message);
                }}>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Cantidad de tokens a incrementar'
                    ref={(input) => {this.quantity = input}}/>

                  <input 
                    type="submit" 
                    className='btn btn-block btn-warning btn-sm' 
                    value='Incrementar tokens'/>

                </form>


                

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
