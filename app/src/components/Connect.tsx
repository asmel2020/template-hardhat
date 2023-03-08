import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "react-bootstrap";
import { bscTestnet } from "wagmi/chains";
export const Connect = () => {
  const {isConnected } = useAccount();
  const { connect } = useConnect({
    chainId: bscTestnet.id,
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
};
