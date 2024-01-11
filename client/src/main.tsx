import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SetupResult, setup } from "./dojo/setup";
import { DojoProvider } from "./DojoContext";
import { LoadingScreen } from "./LoadingScreen";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

function Main() {
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);

  useEffect(() => {
    async function initialize() {
      const result = await setup();
      setSetupResult(result);
    }

    initialize();
  }, []);

  if (!setupResult) {
    // Render the LoadingScreen component while setup is not complete
    return <LoadingScreen />;
  }

  return (
    <React.StrictMode>
      <DojoProvider value={setupResult}>
        <App />
      </DojoProvider>
    </React.StrictMode>
  );
}

root.render(<Main />);
