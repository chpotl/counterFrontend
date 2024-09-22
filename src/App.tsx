import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "@ton/core";
import WebApp from "@twa-dev/sdk";

function App() {
  const { contract_address, counter, balance, sendIncrement, sendDeposit, sendWithdraw } = useMainContract();

  const { connected } = useTonConnect();

  const showAlert = () => {
    WebApp.showAlert("Hello from TON");
  };
  return (
    <div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Platform: {WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className="Hint">{fromNano(balance)}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter ?? "Loading..."}</div>
        </div>
        {connected && <button onClick={sendIncrement}>Send Increment by 5</button>}
        {connected && <button onClick={sendDeposit}>Deposit 0.1 TON</button>}
        {connected && <button onClick={sendWithdraw}>Withdraw 0.1 TON</button>}
        <button onClick={showAlert}>Show Alert</button>
      </div>
    </div>
  );
}

export default App;
