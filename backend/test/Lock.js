import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PaymentGateway Deep Grind", function () {
  let gateway, mockUSDT, owner, alice, bob;
  const FEE_BPS = 200; // 2% fee

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    // 1. Deploy Gateway
    const GatewayFactory = await ethers.getContractFactory("PaymentGateway");
    gateway = await GatewayFactory.deploy(FEE_BPS);

    // 2. Deploy Mock Token for Testing
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    mockUSDT = await MockTokenFactory.deploy();
    
    // Give Alice some tokens and approve the gateway
    await mockUSDT.mint(alice.address, ethers.parseUnits("1000", 18));
    await mockUSDT.connect(alice).approve(gateway.target, ethers.parseUnits("1000", 18));
  });

  describe("Payment Logic", function () {
    it("Should record ETH payment with correct fee math", async function () {
      const payAmount = ethers.parseEther("10");
      await gateway.connect(alice).payETH({ value: payAmount });

      const p = await gateway.payments(alice.address, 0);
      expect(p.amount).to.equal(ethers.parseEther("9.8")); // 10 - 2%
      expect(p.fees).to.equal(ethers.parseEther("0.2"));
    });

    it("Should pull ERC20 tokens from user", async function () {
      const amount = ethers.parseUnits("100", 18);
      await gateway.connect(alice).payERC20(mockUSDT.target, amount);

      expect(await mockUSDT.balanceOf(gateway.target)).to.equal(amount);
    });
  });

  describe("Escrow & Security", function () {
    it("Should allow user to refund BEFORE 24 hours", async function () {
      await gateway.connect(alice).payETH({ value: ethers.parseEther("1") });
      
      // Alice calls refund
      await expect(gateway.connect(alice).Refunded(0))
        .to.emit(gateway, "refunded");
    });

    it("Should REVERT if owner tries to withdraw before 24 hours", async function () {
      await gateway.connect(alice).payETH({ value: ethers.parseEther("1") });
      
      await expect(gateway.connect(owner).WithDraw(alice.address, 0))
        .to.be.revertedWith("Escrow Still active----");
    });

    it("Should allow batch withdrawal after 24 hours", async function () {
      // 1. Alice pays 1 ETH and 100 USDT
      await gateway.connect(alice).payETH({ value: ethers.parseEther("1") });
      await gateway.connect(alice).payERC20(mockUSDT.target, ethers.parseUnits("100", 18));

      // 2. Fast forward 25 hours
      await time.increase(25 * 3600);

      // 3. Owner withdraws all Alice's payments
      const initialEthBal = await ethers.provider.getBalance(owner.address);
      await gateway.connect(owner).withDrawAll([0, 1], alice.address);

      // 4. Check results
      expect(await mockUSDT.balanceOf(owner.address)).to.equal(ethers.parseUnits("100", 18));
      const finalEthBal = await ethers.provider.getBalance(owner.address);
      expect(finalEthBal).to.be.gt(initialEthBal);
    });
  });

  describe("Access Control", function () {
    it("Should not let Bob withdraw Alice's money", async function () {
       await gateway.connect(alice).payETH({ value: ethers.parseEther("1") });
       await time.increase(25 * 3600);
       
       await expect(gateway.connect(bob).WithDraw(alice.address, 0))
         .to.be.revertedWith("You are not the owner");
    });
  });
});