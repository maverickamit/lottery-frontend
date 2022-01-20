import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";
import {
  Container,
  Menu,
  Header,
  Form,
  Button,
  Card,
  Divider,
  Message,
} from "semantic-ui-react";

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
  const handleClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage("A winner has been picked!");
  };

  const connectWallet = async () => {
    await ethereum.request({ method: "eth_requestAccounts" });
    setWalletConnected(true);
  };

  const items = [
    {
      header: "Manager",
      description: ` This contract is managed by ${manager}.`,
      fluid: true,
    },
    {
      header: "Stats",
      description: ` There are currently
       ${players.length} people entered, competing to
        win ${web3.utils.fromWei(balance)} ether.`,
      fluid: true,
    },
  ];

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
    <Container>
      <Menu fluid widths={1}>
        <Menu.Item header>Lottery Contract</Menu.Item>
      </Menu>
      <Card.Group items={items} />
      <Divider />
      {walletConnected ? (
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Header size="medium">Want to try your luck?</Header>
              <label>Amount of ether to enter</label>
              <input type="text" value={value} onChange={handleChange} />
            </Form.Field>
            <Button type="submit" primary>
              Submit
            </Button>
          </Form>
          <Divider />
          <h4>Ready to pick a winner?</h4>
          <Button onClick={handleClick} color="teal">
            Pick a winner
          </Button>
          <Divider />
        </div>
      ) : (
        <Button onClick={connectWallet} color="green">
          Connect Wallet
        </Button>
      )}
      <Message hidden={!message}>{message}</Message>
    </Container>
  );
};
export default App;
