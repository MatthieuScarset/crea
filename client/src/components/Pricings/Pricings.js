import PropTypes from "prop-types";
import React from "react";

const Pricings = (props) => (
  <ul className="mt-2 mb-2 list-none" data-testid="Pricings">
    <li
      key="legend"
      className="flex flex-row justify-between items-center p-2 text-xl italic"
    >
      <span>Label</span>
      <span>Price</span>
    </li>
    {props.items.length > 0 ? (
      props.items.map(function (item, i) {
        return (
          <li
            key={i}
            className="flex flex-row justify-between items-center p-4 text-xl border-solid border-transparent border-2 border-gray-600 cursor-not-allowed  hover:text-gray-600"
            title="Prices cannot be edited yet."
          >
            <span>{item.label}</span>
            <span>{item.price} ETH</span>
          </li>
        );
      })
    ) : (
      <li key="" className="italic text-gray-700">
        No pricing yet
      </li>
    )}
  </ul>
);

Pricings.propTypes = {
  items: PropTypes.array.isRequired,
};

Pricings.defaultProps = {
  items: [],
};

export default Pricings;
