import PropTypes from "prop-types";
import React from "react";

class PricingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: null, amount: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let key = event.target.name;
    let value = event.target.value;
    this.setState({ [key]: value });
  }

  handleSubmit(event) {
    console.log("A name was submitted: " + this.state.name);
    console.log("A name was submitted: " + this.state.amount);
    event.preventDefault();
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
          />
        </label>
        <label className="flex flex-col">
          Price
          <input
            name="amount"
            type="number"
            placeholder="1 ETH"
            onChange={this.handleChange}
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
  name: PropTypes.string,
  amount: PropTypes.number,
};

PricingForm.defaultProps = {
  name: null,
  amount: null,
};

export default PricingForm;
