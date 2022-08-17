import { ethers, providers } from "ethers";
import tokenAbi from "./../contracts/ABI/Token.json";
import bankAbi from "./../contracts/ABI/Bank.json";
import hardhatContracts from "./../contracts/hardhat_contracts.json";

const TOKEN_CONTRACT = hardhatContracts["31337"].localhost.contracts.Token.address;
const BANK_CONTRACT = hardhatContracts["31337"].localhost.contracts.Bank.address;

const UnbundledTransaction = ({ account }) => {
  const getERC20Contract = provider => {
    return new ethers.Contract(TOKEN_CONTRACT, tokenAbi, provider);
  };

  const getBankContract = provider => {
    return new ethers.Contract(BANK_CONTRACT, bankAbi, provider);
  };

  const mint = async () => {
    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const userNonce = await provider.getTransactionCount(account);
      const tokenNonce = await provider.getTransactionCount(TOKEN_CONTRACT);
      const bankNonce = await provider.getTransactionCount(BANK_CONTRACT);
      console.log("userNonce: ", userNonce);
      console.log("tokenNonce: ", tokenNonce);
      console.log("bankNonce: ", bankNonce);

      const erc20 = getERC20Contract(provider);

      const mintTransaction = await erc20.connect(signer).mint(account, ethers.utils.parseEther("10"));
      await mintTransaction.wait();

      console.log("Mint transaction success");
    } catch (error) {
      console.log("An unexpected error has occured: ", error);
    }
  };

  const approve = async () => {
    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const erc20 = getERC20Contract(provider);

      const approveTransaction = await erc20.connect(signer).approve(BANK_CONTRACT, ethers.utils.parseEther("10"));
      await approveTransaction.wait();

      console.log("approve transaction success");
    } catch (error) {
      console.log("An unexpected error has occured: ", error);
    }
  };

  const deposit = async () => {
    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const bank = getBankContract(provider);

      const depositTransaction = await bank.connect(signer).deposit(TOKEN_CONTRACT, ethers.utils.parseEther("10"));
      await depositTransaction.wait();

      console.log("deposit transaction success");
    } catch (error) {
      console.log("An unexpected error has occured: ", error);
    }
  };

  return (
    <div>
      <label>Click here to deposit your funds in 3 transactions</label>
      <button onClick={async () => await mint()}>Mint</button>
      <button onClick={async () => await approve()}>Approve</button>
      <button onClick={async () => await deposit()}>Deposit</button>
    </div>
  );
};

export default UnbundledTransaction;
