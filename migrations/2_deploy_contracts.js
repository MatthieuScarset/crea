const UniversalPricing = artifacts.require("UniversalPricing");

module.exports = function (deployer) {
  deployer.deploy(UniversalPricing);
};
