import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import UserProfile from "./Pages/Profile/Profle";
import ProfileDisplay from "./Pages/ProfileDisplay/ProfileDisplay";
import { Toaster } from "react-hot-toast";
import CustomerProfile from "./Pages/CustomerProfile/CustomerProfile";

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile-display" element={<ProfileDisplay />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
      </Routes>
    </div> 
  );
}

export default App;
