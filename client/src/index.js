import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));

// Do not know why we would need a service worker for now...
// @see https://medium.com/coinmonks/react-service-worker-web3-android-98970a6691ad
// serviceWorker.unregister();
