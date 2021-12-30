import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");

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
    </div>
  );
};

export default App;
