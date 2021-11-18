// =============================================================================
// Helpers
// =============================================================================
async function getGasCost(promise, txParams) {
  const valueTransferred = web3.utils.toBN(
    !txParams.value ? 0 : txParams.value
  );
  const senderBalanceBefore = web3.utils.toBN(
    await web3.eth.getBalance(txParams.from)
  );
  await promise;
  const senderBalanceAfter = web3.utils.toBN(
    await web3.eth.getBalance(txParams.from)
  );
  const gasCost = senderBalanceBefore
    .sub(senderBalanceAfter)
    .abs()
    .sub(valueTransferred);
  return gasCost;
}

async function tryCatch(promise) {
  const errorString = "VM Exception while processing transaction: ";
  const reason = "revert";
  try {
    await promise;
    throw null;
  } catch (error) {
    assert(error, "Expected a VM exception but did not get one");
    assert(
      error.message.search(errorString + reason) >= 0,
      "Expected an error containing '" +
        errorString +
        reason +
        "' but got '" +
        error.message +
        "' instead"
    );
  }
}

const UniversalPricing = artifacts.require("UniversalPricing");

// =============================================================================
// Tests
// =============================================================================
contract("UniversalPricing", (accounts) => {
  const owner = accounts[0];
  const creator = accounts[1];
  const attacker = accounts[9];
  const txAmount = web3.utils.fromWei("3", "ether");
  const singlePrice = 1;

  before("Setup contract", async () => {
    universalPricing = await UniversalPricing.new();
  });

  // Step 0
  describe("Step 0", async () => {
    it("Should store the deployer address as owner", async () => {
      assert.equal(
        owner,
        await universalPricing.owner(),
        "The owner variable does not contain the deployer's address"
      );
    });
  });

  // Step 1
  describe("Step 1 - Add pricing", async () => {
    it("Should allow owner to add a pricing successfully", async () => {
      const { logs } = await universalPricing.addPricing("Logo", 1);
      const log = logs[0];
      assert.equal(log.event, "NewPricing");
      assert.equal(log.args.index.toString(), "0");

      const pricing = await universalPricing.pricings(0);
      assert.equal(pricing.price.toString(), "1");
      assert.equal(pricing.label, "Logo");
      assert.equal(pricing.price.toString(), "1");
    });

    it("Should allow owner to add another pricing successfully", async () => {
      const { logs } = await universalPricing.addPricing("Logo", 2);
      const log = logs[0];
      assert.equal(log.event, "NewPricing");
      assert.equal(log.args.index.toString(), "1");

      const pricing = await universalPricing.pricings(1);
      assert.equal(pricing.price.toString(), "2");
    });

    /*
    it("Should prevent attacker from adding a pricing", async () => {
      assert.equal(
        false,
        await universalPricing.addPricing("Logo", singlePrice, {
          from: attacker,
        }),
        "An attacker is able to add a new pricing"
      );
    });
    */

    // addCategory();
    // assignCategory();
  });

  // Step 2
  describe("Step 2 - Edit/Drop pricing", async () => {
    /*
    it("Should allow anyone to edit a pricing", async () => {
      let index = 0;
      let newName = "Logo design";

      assert.equal(
        true,
        await universalPricing.editPricing(index, newName, singlePrice, {
          from: creator,
          value: txAmount,
        }),
        "A creator cannot edit a pricing"
      );
    });
    */
    // editCategory();
    // disablePricing();
  });

  // Step 3
  describe("Step 3 - Publish pricing", async () => {
    // publishPricing(mulisigned);
  });
});
