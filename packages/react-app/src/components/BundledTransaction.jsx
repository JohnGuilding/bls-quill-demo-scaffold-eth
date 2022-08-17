import { ethers, providers } from "ethers";
import tokenAbi from "./../contracts/ABI/Token.json";
import bankAbi from "./../contracts/ABI/Bank.json";
import hardhatContracts from "./../contracts/hardhat_contracts.json";

const TOKEN_CONTRACT = hardhatContracts["31337"].localhost.contracts.Token.address;
const BANK_CONTRACT = hardhatContracts["31337"].localhost.contracts.Bank.address;

const BundledTransaction = ({ account }) => {
  const getERC20Contract = provider => {
    return new ethers.Contract(TOKEN_CONTRACT, tokenAbi, provider);
  };

  const getBankContract = provider => {
    return new ethers.Contract(BANK_CONTRACT, bankAbi, provider);
  };

  const depositFundsBundled = async () => {
    try {
      const areMultiActionTransactionSupported = !!window.ethereum.isQuill;
      if (areMultiActionTransactionSupported) {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const erc20 = getERC20Contract(provider);
        const bank = getBankContract(provider);

        const mintTransaction = await erc20
          .connect(signer)
          .populateTransaction.mint(account, ethers.utils.parseEther("10"));
        const approveTransaction = await erc20
          .connect(signer)
          .populateTransaction.approve(BANK_CONTRACT, ethers.utils.parseEther("10"));
        const depositTransaction = await bank
          .connect(signer)
          .populateTransaction.deposit(TOKEN_CONTRACT, ethers.utils.parseEther("10"));

        const transactionHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [mintTransaction, approveTransaction, depositTransaction],
        });

        const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
        console.log("Bundle success: ", transactionReceipt);
      } else {
        console.log("You need to install Quill");
      }
    } catch (error) {
      console.log("An unexpected error has occured: ", error);
    }
  };
  return (
    <div>
      <label>Click here to bundle your mint, approve and deposit transactions into one</label>
      <button onClick={async () => await depositFundsBundled()}>Bundle transactions</button>
    </div>
  );
};

export default BundledTransaction;
