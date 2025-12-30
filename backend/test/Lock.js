import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PaymentGateway", function () {
  let gateway , mockUSDT , ammad ,hasan , owner;
  const fee_bps=200;

  beforeEach(async function () {
    [owner , ammad , hasan ]=await ethers.getSigners();
    //gateway -- deployment--
    const gatewayFactory=await ethers.getContractFactory("PaymentGateway");
    gateway=await gatewayFactory.deploy(fee_bps);

    //mock usdt for testing----

    const mockTokenUsdt=await ethers.getContractFactory("MockToken");
    mockUSDT=await mockTokenUsdt.deploy();

    //some tokens to ammad ---
    await mockUSDT.mint(ammad.address,ethers.parseUnits("1000",18));
    await mockUSDT.connect(ammad).approve(gateway.target,ethers.parseUnits("1000",18));
    console.log(gateway.target);

  })

  describe("Payment Check",function(){
    it("it should record eth plus fees",async function () {
      const payAmount=ethers.parseEther("10",18);
      const payAmount2=ethers.parseUnits("10");
      console.log(payAmount);
      console.log(payAmount2);

      await gateway.connect(ammad).payETH({value:payAmount});

      const p=await gateway.payments(ammad.address , 0);

      expect(p.amount).to.equal(ethers.parseEther("9.8"));//because 0.2 for feessssss
      expect(p.fees).to.equal(ethers.parseEther("0.2"));


      
    });

    it("check erc20 behaviour--",async function () {
      const payAmount=ethers.parseUnits("10",18);

      await gateway.connect(ammad).payERC20(mockUSDT.target,payAmount);

      const payment=await gateway.payments(ammad.address,0);

      expect(payment.amount).to.equal(ethers.parseUnits("9.8",18));
      expect(payment.fees).to.equal(ethers.parseUnits("0.2",18));
      expect(await mockUSDT.balanceOf(gateway.target)).to.equal(payAmount);

    })
  })

  describe("Escrow Behaviour",function () {
    it("Should allow user to refund before 24 hr",async function () {
      await gateway.connect(ammad).payETH({value:ethers.parseEther("1")});
      expect (gateway.connect(ammad).Refunded(0)).to.be.emit(gateway,"refunded")

    });
    it("Owner cannot withdraw money before time",async function () {
      await gateway.connect(ammad).payETH({value:ethers.parseEther("1")});

      await expect(gateway.connect(owner).WithDraw(ammad.address,0)).to.be.revertedWith("Escrow still active");
    });

    it("owner can withdraw after 24 hours",async function () {
      await gateway.connect(ammad).payETH({value:ethers.parseEther("1")});
      await time.increase(25*3600);

      const balanceBefore=await ethers.provider.getBalance(owner.address);
      await gateway.connect(owner).WithDraw(ammad.address,0);
      const balanceAfter=await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should allow batch withdrawl after 24 hours",async function () {
      await gateway.connect(ammad).payETH({value:ethers.parseEther("1")});
      await gateway.connect(ammad).payERC20(mockUSDT.target ,ethers.parseUnits("100",18));
      await time.increase(25*3600);
      const initialETHBalance=await ethers.provider.getBalance(owner.address);
      await gateway.connect(owner).withDrawAll([0,1],ammad.address);

      expect(await mockUSDT.balanceOf(owner.address)).to.equal(ethers.parseUnits("100",18));
      const finalEthBalance=await ethers.provider.getBalance(owner.address);

      expect(finalEthBalance).to.be.gt(initialETHBalance);
    })
  })

  
});