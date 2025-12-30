import hre from "hardhat"

async function main() {
  const feeBPS = 200; // 2%
  const gateway = await hre.ethers.deployContract("PaymentGateway", [feeBPS]);

  await gateway.waitForDeployment();

  console.log(`PaymentGateway deployed to: ${gateway.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});