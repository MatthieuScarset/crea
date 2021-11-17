import PropTypes from "prop-types";
import React from "react";
import "./Pricings.css";

const Pricings = (props) => (
  <ul className="list-none" data-testid="Pricings">
    {props.items.length > 0 ? (
      props.items.map(function (item, i) {
        return <li className="italic">{item.name}</li>;
      })
    ) : (
      <li className="italic text-gray-700">No pricing yet</li>
    )}
  </ul>
);

Pricings.propTypes = {
  items: PropTypes.array.isRequired,
};

Pricings.defaultProps = {};

export default Pricings;
