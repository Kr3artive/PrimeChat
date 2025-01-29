import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import VerifyOtp from "./pages/VerifyOtp";
import Chat from "./pages/Chat";


const App = () => {
  return (
    <div className="overflow-hidden min-h-100vh">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verifyotp" element={<VerifyOtp/>} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
