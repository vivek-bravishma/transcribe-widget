import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:3000"); // Replace with your server URL

    // Handle incoming data from the server
    socket.on("data", (data) => {
      // Do something with the data received from the server
      console.log("Received data from server:", data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1>Sup Bro</h1>
    </>
  );
}

export default App;
