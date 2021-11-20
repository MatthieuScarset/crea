const { expectRevert } = require("@openzeppelin/test-helpers");
const PricingSheet = artifacts.require("PricingSheet");

contract("PricingSheet", (accounts) => {
  const owner = accounts[0];
  const userA = accounts[1];
  const userB = accounts[2];
  const userC = accounts[3];
  const feeAmount = 1;
  const disabledPricingExceptionText = "Pricing is not available anymore.";

  before("Setup contract", async () => {
    instance = await PricingSheet.new();
  });

  describe("Basic", async () => {
    it("Get empty pricing list", async () => {
      assert.equal(
        0,
        await instance.getPricingsLength(),
        "Default pricing list is not empty."
      );
    });
    it("Set fee price", async () => {
      const { logs } = await instance.setFee(feeAmount, { from: owner });
      const log = logs[0];
      assert.equal(log.event, "NewFee");
      assert.equal(log.args.amount.toString(), feeAmount);
    });
  });

  describe("Pricing", async () => {
    it("Users can add a first pricing", async () => {
      let _label = "Logo";
      let _price = 69;
      const { logs } = await instance.addPricing(_label, _price, {
        from: userA,
        value: web3.utils.toWei(feeAmount.toString(), "ether"),
      });
      const log = logs[0];
      assert.equal(log.event, "NewPricing");
      assert.equal(log.args.index.toString(), "0");

      const pricing = await instance.getPricing(0);
      assert.equal(pricing.label, _label);
      assert.equal(pricing.price.toString(), _price);
    });

    it("Users can add a second pricing", async () => {
      let _label = "Flyer";
      let _price = 42;
      const { logs } = await instance.addPricing(_label, _price, {
        from: userB,
        value: web3.utils.toWei(feeAmount.toString(), "ether"),
      });
      const log = logs[0];
      assert.equal(log.event, "NewPricing");
      assert.equal(log.args.index.toString(), "1");

      const pricing = await instance.getPricing(1);
      assert.equal(pricing.label, _label);
      assert.equal(pricing.price.toString(), _price);
    });

    it("Users can edit a pricing", async () => {
      let i = 0;
      let _label = "Boomshakalakah";
      let _price = 369;
      const { logs } = await instance.editPricing(i, _label, _price, {
        from: userC,
        value: web3.utils.toWei(feeAmount.toString(), "ether"),
      });
      const log = logs[0];
      assert.equal(log.event, "PricingUpdated");
      assert.equal(log.args.index.toString(), i.toString());

      const pricing = await instance.getPricing(i);
      assert.equal(pricing.label, _label);
      assert.equal(pricing.price.toString(), _price);
    });

    it("Users can disable a pricing", async () => {
      let i = 0;
      const { logs } = await instance.disablePricing(i, {
        from: userA,
        value: web3.utils.toWei(feeAmount.toString(), "ether"),
      });
      const log = logs[0];
      assert.equal(log.event, "PricingDisabled");
      assert.equal(log.args.index.toString(), i.toString());

      const pricing = await instance.getPricing(i);
      assert.equal(pricing.available, false);
    });

    it("Users cannot edit a disabled pricing", async () => {
      let i = 0;
      let _label = "Evil dead";
      let _price = 666;

      await expectRevert(
        instance.editPricing(i, _label, _price, {
          from: userC,
          value: web3.utils.toWei(feeAmount.toString(), "ether"),
        }),
        disabledPricingExceptionText
      );
    });
  });
});
