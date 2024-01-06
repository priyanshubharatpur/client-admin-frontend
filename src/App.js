import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import HomePage from "./HomePage";
import { AuthProvider } from "./AuthContext";
import ProtectedUpload from "./ProtectedUpload";
import ProtectedMediaPreview from "./ProtectedMediaPreview";
import UserDetails from "./UserDetails";
import Users from "./Users";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/upload" element={<ProtectedUpload />} />
          <Route path="/preview" element={<ProtectedMediaPreview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:phone" element={<UserDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
