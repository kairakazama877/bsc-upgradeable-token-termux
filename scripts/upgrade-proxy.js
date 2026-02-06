// Run with: npx hardhat run scripts/upgrade-proxy.js --network bscTestnet
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) {
    throw new Error("Set PROXY_ADDRESS env to the proxy you want to upgrade");
  }

  console.log("Upgrading proxy:", proxyAddress);
  const NewImpl = await ethers.getContractFactory("MyBEP20UpgradeableV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, NewImpl);
  console.log("Upgraded proxy at:", upgraded.target ?? upgraded.address);
  const impl = await upgrades.erc1967.getImplementationAddress(upgraded.target ?? upgraded.address);
  console.log("New implementation at:", impl);

  // initializeV2 if needed
  try {
    const tx = await upgraded.initializeV2?.();
    if (tx) {
      console.log("Called initializeV2 tx:", tx.hash);
      await tx.wait();
    }
  } catch (err) {
    console.log("No initializeV2 or already initialized:", err.message || err);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
