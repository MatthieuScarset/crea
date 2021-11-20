import { create } from "ipfs-http-client";
import React, { Component } from "react";
import PricingForm from "./components/PricingForm/PricingForm";
import Pricings from "./components/Pricings/Pricings";
import PricingSheet from "./contracts/PricingSheet.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    pricings: [],
    ipfs: null,
    docHash: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PricingSheet.networks[networkId];
      const instance = new web3.eth.Contract(
        PricingSheet.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, contract and Pricings to the state.
      this.setState({
        web3,
        accounts,
        contract: instance,
      });
    } catch (error) {
      alert(
        "Failed to load web3, accounts, or contract. Check console for details."
      );
      console.error(error);
    }

    try {
      const pricings = await this.getPricings();
      this.setState({ pricings: pricings });
    } catch (error) {
      alert(
        "Failed to pricing, accounts, or contract. Check console for details."
      );
      console.error(error);
    }

    try {
      // Get web3 storage client.
      const ipfsHttpClient = await create("https://ipfs.infura.io:5001/api/v0");
      this.setState({ ipfs: ipfsHttpClient });

      // Form binding.
      this.publishToIpfs = this.publishToIpfs.bind(this);
    } catch (error) {
      alert("Failed to load IPFS client. Check console for details.");
      console.error(error);
    }

    try {
      const docHash = await this.getDocument();
      this.setState({ docHash: docHash });
    } catch (error) {
      console.error(
        "Could not load document. Maybe none exists onchain yet..."
      );
    }
  };

  /**
   * Load existing pricings.
   *
   * @todo Refresh pricings list on PricingForm tx success.
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

    return list;
  };

  /**
   * Get latest document hash.
   *
   * @todo Refresh hash when user publish to IPFS again.
   */
  getDocument = async () => {
    let _hash = await this.state.contract.methods.getDocument().call({
      from: this.state.accounts[0],
    });

    return _hash;
  };

  /**
   * Generate new pricing sheet and publish it to IPFS.
   *
   * Feeds the contract back.
   *
   * @todo Filter pricings items by status "available" or not.
   */
  publishToIpfs = async () => {
    const blob = new Blob([JSON.stringify(this.state.pricings)], {
      type: "application/json",
    });

    const file = new File([blob], "universal_pricing_sheet.json");

    const added = await this.state.ipfs.add(file);

    const url = "https://ipfs.infura.io/ipfs/" + added.path;
    console.log(url);

    await this.state.contract.methods.setDocument(url).send({
      from: this.state.accounts[0],
      value: this.state.web3.utils.toWei("1", "ether"),
    });
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
            <h2 className="text-xl font-extrabold">Universal pricings</h2>

            <div className="flex flex-col space-y-0.5">
              {this.state.docHash.length === 0 ? (
                ""
              ) : (
                <a
                  title="Latest version of the Universal pricing sheet"
                  target="_blank"
                  href={this.state.docHash}
                  className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  See latest version
                </a>
              )}

              <a
                onClick={this.publishToIpfs}
                className="block text-center bg-green-600 text-white hover:bg-green-800 font-bold py-2 px-4 rounded cursor-pointer"
              >
                Publish new version to IPFS
              </a>
            </div>

            <Pricings items={this.state.pricings} />
          </div>

          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-extrabold">Add a new pricing</h2>
            <PricingForm
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.accounts[0]}
            />
          </div>

          <div className="bg-gray-100 rounded-xl p-8">
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-extrabold">Versions</h2>
              <p>Work in progress...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
