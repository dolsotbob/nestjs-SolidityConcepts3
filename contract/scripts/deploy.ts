import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Todo: deploy script를 구현하여 주세요.

  const MathLibrary = await ethers.getContractFactory('MathLibrary');
  const mathLibrary = await MathLibrary.deploy();
  await mathLibrary.waitForDeployment();

  const Calculator = await ethers.getContractFactory('Calculator', {
    libraries: {
      'contracts/MathLibrary.sol:MathLibrary': mathLibrary.target,
    },
  });
  const contract = await Calculator.deploy();

  console.log(`Calculator contract deployed at: ${contract.target}`);
  await makeAbi('Calculator', contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
