import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";
const { ethereum } = window;
const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (value) {
      setMessage("Waiting on transaction success...");
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      setMessage("You have entered!");
    }
  };
  const connectWallet = async () => {
    await ethereum.request({ method: "eth_requestAccounts" });
    setWalletConnected(true);
  };

  useEffect(() => {
    const checkIfWalletConnected = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length !== 0) {
        setWalletConnected(true);
      }
    };
    checkIfWalletConnected();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedManager = await lottery.methods.manager().call();
      setManager(fetchedManager);

      const fetchedPlayers = await lottery.methods.getPlayers().call();
      setPlayers(fetchedPlayers);

      const fetchedBalance = await web3.eth.getBalance(lottery.options.address);
      setBalance(fetchedBalance);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}.</p>
      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance)} ether.
      </p>
      <hr />
      {walletConnected ? (
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Want to try your luck?</h2>
            <label>Amount of ether to enter </label>
            <input type="text" value={value} onChange={handleChange} />
          </div>
          <input type="submit" value="Submit" />
        </form>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <hr />
      <h2>{message}</h2>
    </div>
  );
};

export default App;
