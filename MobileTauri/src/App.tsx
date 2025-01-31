import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Page from "./components/Page";
import ScannerPage from "./components/Scanner";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/classes"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Navbar />
              <Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Navbar />
              <ScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Navbar />
              <Logout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;