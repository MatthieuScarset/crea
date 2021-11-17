import React, { Component } from "react";
import "./App.css";
import Pricings from "./components/Pricings/Pricings";
import UniversalPricing from "./contracts/UniversalPricing.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = { pricings: [], web3: null, accounts: null, contract: null };

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getPricings);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getPricings = async (start = 0, end = 10) => {
    const { account, contract } = this.state;

    const list = [];
    let i = start;
    do {
      try {
        let price = await contract.methods.pricings(i).call();
        console.log(i, price);
        i++;
      } catch (error) {
        // Fail silently.
        break;
      }
    } while (i <= end);

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
            className="m-auto max-h-40"
            src="logo.svg"
            alt="Logo of the CREA project"
          />
          <h1 className="visually-hidden">CREA</h1>
        </header>

        <main className="flex flex-col space-y-10 md:space-y-8">
          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-extrabold">Add a new pricing</h2>
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
