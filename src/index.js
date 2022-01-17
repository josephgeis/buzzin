import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";
import { createBrowserHistory } from "history";

if (process.env.REACT_APP_ENABLE_GA === "true") {
  ReactGA.initialize(process.env.REACT_APP_GA_TOKEN);

  const history = createBrowserHistory();

  history.listen((location) => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.send({ hitType: "pageview", page: location.pathname }); // Record a pageview for the given page
  });

  reportWebVitals(({ name, delta, id }) => {
    ReactGA.event({
      category: "Web Vitals",
      action: name,
      value: Math.round(name === "CLS" ? delta * 1000 : delta),
      label: id,
      nonInteraction: true,
    });
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals(console.log);
