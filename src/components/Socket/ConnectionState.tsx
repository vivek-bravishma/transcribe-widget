import React from "react";
import { ConnectionManager } from "./ConnectionManager";
import { socket } from "../../utils/socket";

export function ConnectionState({ isConnected }) {
  function connect() {
    socket.connect();
    console.log("zhal connect");
  }

  function disconnect() {
    socket.disconnect();
    console.log("zhal disconnect");
  }

  return (
    // <>
    // 	<p>State: {"" + isConnected}</p>
    // 	<ConnectionManager />
    // </>

    <div className="socket-connection-state tw-tooltip">
      {isConnected ? (
        <>
          <span
            className="connection-state__icon connection-state__icon--connected neo-icon-socket-connected"
            aria-label="Socket Connection state - Connected"
          >
            c
          </span>
          <span className="tw-tooltip-text">Connected</span>
        </>
      ) : (
        <>
          <span
            className="connection-state__icon connection-state__icon--disconnected neo-icon-socket-disconnected"
            aria-label="Socket Connection state - Disconnected"
            onClick={connect}
          >
            dc
          </span>
          <span className="tw-tooltip-text">Reconnect</span>
        </>
      )}
    </div>
  );
}
