import PropTypes from "prop-types";
import React from "react";

class PricingForm extends React.Component {
  constructor(props) {
    super(props);
    this.web3 = props.web3;
    this.contract = props.contract;
    this.account = props.account;
    this.state = { name: null, amount: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let key = event.target.name;
    let value = event.target.value;
    this.setState({ [key]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(
      "A new pricing was submitted with: " +
        this.state.name +
        " " +
        this.state.amount
    );

    // @todo Send transaction
    // const { logs } = await this.contract.methods.addPricing("Logo", 1);
    const result = await this.contract.methods
      .addPricing(this.state.name, this.state.amount)
      .send({
        from: this.account,
        value: this.web3.utils.toWei("1", "ether"),
      });

    console.log(result);
  }

  render() {
    return (
      <form
        className="flex flex-col space-y-2"
        data-testid="PricingForm"
        onSubmit={this.handleSubmit}
      >
        <label className="flex flex-col">
          Name
          <input
            name="name"
            type="text"
            placeholder="Flyer design"
            onChange={this.handleChange}
            required
          />
        </label>
        <label className="flex flex-col">
          Price
          <input
            name="amount"
            type="number"
            placeholder="1 ETH"
            onChange={this.handleChange}
            required
          />
        </label>
        <input
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          value="Add"
        />
      </form>
    );
  }
}

PricingForm.propTypes = {
  web3: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  name: PropTypes.string,
  amount: PropTypes.number,
};

PricingForm.defaultProps = {
  name: null,
  amount: null,
};

export default PricingForm;
