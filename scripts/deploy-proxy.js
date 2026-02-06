// Run with: npx hardhat run scripts/deploy-proxy.js --network bscTestnet
const { ethers, upgrades } = require("hardhat");

async function main() {
  const name = process.env.TOKEN_NAME || "My Token";
  const symbol = process.env.TOKEN_SYMBOL || "MTK";
  const initialSupply = ethers.parseUnits(process.env.INITIAL_SUPPLY || "1000000", 18);
  const owner = process.env.OWNER_ADDRESS || (await (await ethers.getSigners())[0]).address;

  console.log("Deploying proxy with:", { name, symbol, initialSupply: initialSupply.toString(), owner });

  const Factory = await ethers.getContractFactory("MyBEP20Upgradeable");
  const instance = await upgrades.deployProxy(Factory, [name, symbol, initialSupply, owner], { initializer: "initialize", kind: "uups" });
  await instance.deployed();

  console.log("Proxy deployed to:", instance.target ?? instance.address);
  const impl = await upgrades.erc1967.getImplementationAddress(instance.target ?? instance.address);
  console.log("Implementation at:", impl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
