import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

import AppRoutes from "./AppRoutes";
import SocketProvider from "./SocketProvider";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const isLoading = useSelector((state) => state.app.isLoading);
  return (
    <>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
      {isLoading && <LoadingOverlay />}
    </>
  );
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
