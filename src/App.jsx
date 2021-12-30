import { useEffect, useState } from "react";
import lottery from "./lottery";

const App = () => {
  const [manager, setManager] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await lottery.methods.manager().call();
      setManager(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
    </div>
  );
};

export default App;
