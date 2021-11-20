const { expectRevert } = require("@openzeppelin/test-helpers");
const ImmutableDocument = artifacts.require("ImmutableDocument");

contract("ImmutableDocument", (accounts) => {
  const owner = accounts[0];
  const userA = accounts[1];
  const userB = accounts[1];
  const attacker = accounts[9];
  const cid = "bafybeib3if7evuzcircwcy4r5sf4iacffqj36iepaafqeexlt3wju3pflm";
  const txAmount = web3.utils.toWei("3", "ether");
  const ownableExceptionText = "Ownable: caller is not the owner";

  before("Setup contract", async () => {
    instance = await ImmutableDocument.new();
  });

  // Ownable
  describe("Basic", async () => {
    it("Should store the deployer address as owner", async () => {
      assert.equal(
        owner,
        await instance.owner(),
        "The owner variable does not contain the deployer's address"
      );
    });

    it("Get default fee price", async () => {
      assert.equal(
        0,
        await instance.getFee(),
        "Default fee does not equal zero"
      );
    });

    it("Set fee price", async () => {
      const { logs } = await instance.setFee(1, { from: owner });
      const log = logs[0];
      assert.equal(log.event, "NewFee");
      assert.equal(log.args.amount.toString(), "1");
    });

    it("Set fee price (as an attacker", async () => {
      await expectRevert(
        instance.setFee(1, { from: attacker }),
        ownableExceptionText
      );
    });
  });

  describe("Document-related tests", async () => {
    it("Should save the first document", async () => {
      const { logs } = await instance.setDocument(cid, {
        from: userA,
        value: txAmount,
      });
      const log = logs[0];
      assert.equal(log.event, "NewVersion");
      assert.equal(log.args.index.toString(), "0");

      assert.equal(
        cid,
        await instance.getDocument(0),
        "Wrong CID when getting first document."
      );
    });

    it("Should save another document", async () => {
      const { logs } = await instance.setDocument(cid, {
        from: userB,
        value: txAmount,
      });
      const log = logs[0];
      assert.equal(log.event, "NewVersion");
      assert.equal(log.args.index.toString(), "1");

      assert.equal(
        cid,
        await instance.getDocument(1),
        "Wrong CID when getting second document."
      );
    });
  });
});
