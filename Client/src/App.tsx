import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <PrimeReactProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </PrimeReactProvider>
  );
}

export default App;
