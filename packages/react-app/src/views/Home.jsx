import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import BundledTransaction from "./../components/BundledTransaction";
import UnbundledTransaction from "./../components/UnbundledTransaction";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home() {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const [account, setAccount] = useState();

  const connectWallet = async () => {
    const account = await window.ethereum.request({ method: "eth_accounts" });
    setAccount(account[0]);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💰</span>
        Quill demo app
      </div>
      <UnbundledTransaction account={account} />
      <BundledTransaction account={account} />
    </div>
  );
}

export default Home;
