import React, { Component } from "react";
import PricingForm from "./components/PricingForm/PricingForm";
import Pricings from "./components/Pricings/Pricings";
import UniversalPricing from "./contracts/UniversalPricing.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, pricings: [] };

  isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UniversalPricing.networks[networkId];
      const instance = new web3.eth.Contract(
        UniversalPricing.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, contract and Pricings to the state.
      this.setState({ web3, accounts, contract: instance }, this.getPricings);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  /**
   * Load existing pricings.
   */
  getPricings = async () => {
    let contract = this.state.contract;

    let list = [];
    let length = await contract.methods.getPricingsLength().call({
      from: this.state.accounts[0],
    });
    for (let i = 0; i < length; i++) {
      let price = await contract.methods.getPricing(i).call({
        from: this.state.accounts[0],
      });
      list.push(price);
    }

    // Update state with the result.
    this.setState({ pricings: list });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="w-full md:w-1/3 m-auto flex flex-col space-y-10 md:space-y-8">
        <header>
          <img
            className="m-auto pt-4 max-h-40"
            src="logo.svg"
            alt="Logo of the CREA project"
          />
          <h1 className="invisible">CREA</h1>
        </header>

        <main className="flex flex-col space-y-10 md:space-y-8">
          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-extrabold">Add a new pricing</h2>
            <PricingForm
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.accounts[0]}
            />
          </div>

          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-extrabold">Existing pricings</h2>
            <Pricings items={this.state.pricings} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
