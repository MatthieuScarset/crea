const PricingSheet = artifacts.require("PricingSheet");

module.exports = function (deployer) {
  deployer.deploy(PricingSheet);
};
