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
    
    const networkId = '5777';
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
    }
  }

  // Función para realizar la compra de tokens
  envio = async(address, quantity) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await this.state.contract.methods.sendTokens(address, quantity).send({from: accounts[0]});
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
                  this.envio(address, quantity);
                }}>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Dirección de destino'
                    ref={(input) => {this.address = input}}/>
                  
                  <input 
                    type="text" 
                    className='form-control mb-1' 
                    placeholder='Cantidad de tokens a comprar'
                    ref={(input) => {this.quantity = input}}/>
                  
                  <input 
                    type="submit" 
                    className='btn btn-block btn-danger btn-sm' 
                    value='Comprar tokens'/>

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
