import { Contract, ContractFactory, Overrides, providers } from "ethers";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";

import { TransactionSubmitter } from "./TransactionSubmitter";
import {
  rpc,
  deployer,
  networkSuffix,
  initGWAccountIfNeeded,
  isGodwoken,
} from "./common";

import Socks from "../artifacts/contracts/Socks.sol/Socks.json";
import UnixSocks from "../artifacts/contracts/Unisocks.sol/Unisocks.json"

type TCallStatic = Contract["callStatic"];

interface ISocksStaticMethods extends TCallStatic {
  supply(): Promise<string>;
}
interface IUniocksStaticMethods extends TCallStatic {
  baseTokenURI(): Promise<string>;
  owner(): Promise<string>;
}

interface ISocks extends Contract, ISocksStaticMethods {
  setNFTAddress(
    address: string,
    override?: Overrides,
  ): Promise<providers.TransactionResponse>;
  callStatic: ISocksStaticMethods;
}
interface IUnisocks extends Contract, IUniocksStaticMethods {
  transferOwnership(
    address: string,
    override?: Overrides,
  ): Promise<providers.TransactionResponse>;
  callStatic: IUniocksStaticMethods;
}

const deployerAddress = deployer.address;
const txOverrides = {
  gasPrice: isGodwoken ? 0 : undefined,
  gasLimit: isGodwoken ? 12_500_000 : undefined,
};

async function main() {
  console.log("Deployer Ethereum address:", deployerAddress);

  await initGWAccountIfNeeded(deployerAddress);

  let deployerRecipientAddress = deployerAddress;
  if (isGodwoken) {
    const { godwoker } = rpc as PolyjuiceJsonRpcProvider;
    deployerRecipientAddress =
      godwoker.computeShortAddressByEoaEthAddress(deployerAddress);
    console.log("Deployer Godwoken address:", deployerRecipientAddress);
  }

  const transactionSubmitter = await TransactionSubmitter.newWithHistory(
    `deploy-yokai-factory${networkSuffix ? `-${networkSuffix}` : ""}.json`,
    Boolean(process.env.IGNORE_HISTORY),
  );

  const receipt = await transactionSubmitter.submitAndWait(
    `Deploying Socks`,
    () => {
      const socks = new ContractFactory(
        Socks.abi,
        Socks.bytecode,
        deployer,
      );
      const tx = socks.getDeployTransaction(
        "500000000000000000000",
      );
      tx.gasPrice = txOverrides.gasPrice;
      tx.gasLimit = txOverrides.gasLimit;
      return deployer.sendTransaction(tx);
    },
  );
  const socksAddress = receipt.contractAddress;
  console.log(`    Socks address:`, socksAddress);

  const socksContract = new Contract(
    socksAddress,
    Socks.abi,
    deployer,
  ) as ISocks;
  const supply = await socksContract.callStatic.supply()
  console.log(
    "    Supply of Socks Token:",
    supply.toString()
  );

  const userBalance = await socksContract.callStatic.balanceOf(deployerAddress)
  console.log(
    "    User Token Balance:",
    userBalance.toString()
  );

  const receipt2 = await transactionSubmitter.submitAndWait(
    `Deploying Unisocks`,
    () => {
      const uniSocks = new ContractFactory(
        UnixSocks.abi,
        UnixSocks.bytecode,
        deployer,
      );
      const tx = uniSocks.getDeployTransaction(
        socksAddress,"abc"
      );
      tx.gasPrice = txOverrides.gasPrice;
      tx.gasLimit = txOverrides.gasLimit;
      return deployer.sendTransaction(tx);
    },
  );
  const uniSocksAddress = receipt2.contractAddress;
  console.log(`    Unisocks address:`, uniSocksAddress);

  const uniSocksContract = new Contract(
    uniSocksAddress,
    UnixSocks.abi,
    deployer,
  ) as IUnisocks;

  console.log(
    "    Base Token URI of Unisocks NFT :",
    await uniSocksContract.callStatic.baseTokenURI(),
  );


  // Unicocks smart contracts level interactions by Owner|Smart Contract Deployer

  // const updateNFTAddressTransactionHash = await socksContract.setNFTAddress(uniSocksAddress);
  // console.log("      updateNFTAddressTransactionHash :",updateNFTAddressTransactionHash.hash);
  
  // const transferOwnershipToSocksContract = await uniSocksContract.transferOwnership(socksAddress);
  // console.log("      transferOwnershipToSocksContract :",transferOwnershipToSocksContract.hash);


  console.log(
    "   Owner of Unisocks Smart Contract :",
    await uniSocksContract.callStatic.owner(),
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log("err", err);
    process.exit(1);
  });
