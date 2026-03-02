const { ethers } = require("hardhat");

async function main() {
  const TaskManager = await ethers.getContractFactory("TaskManager");
  const tm = await TaskManager.deploy();
  await tm.deployed();
  console.log("Contrat déployé à :", tm.address);
}

main().then(() => process.exit(0)).catch((error) => {console.error(error);
    process.exit(1);});