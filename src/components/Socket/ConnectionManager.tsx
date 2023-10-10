import React from "react";
import { socket } from "../../utils/socket";

export function ConnectionManager() {
  function connect() {
    socket.connect();
    console.log("zhal connect");
  }

  function disconnect() {
    socket.disconnect();
    console.log("zhal disconnect");
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}
