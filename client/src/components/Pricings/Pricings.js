import PropTypes from "prop-types";
import React from "react";

const Pricings = (props) => (
  <ul className="list-none" data-testid="Pricings">
    {props.items.length > 0 ? (
      props.items.map(function (item, i) {
        console.log(item);
        return (
          <li
            key={i}
            className="flex flex-row justify-between items-center p-4 text-xl italic hover:bg-blue-500 hover:text-white cursor-not-allowed"
            title="You cannot edit a price yet. Still work in progress..."
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
