import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import UserProfile from "./Pages/Profile/Profle";
import ProfileDisplay from "./Pages/ProfileDisplay/ProfileDisplay";
import { Toaster } from "react-hot-toast";
import CustomerProfile from "./Pages/CustomerProfile/CustomerProfile";
import ClientProfile from "./Pages/ClientProfile/ClientProfie";
import ProviderProfile from "./Pages/ProviderProfile/ProviderProfile";
import ErrorBoundary from "../utils/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary> <div>
     
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile-display" element={<ProfileDisplay />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/profile/provider" element={<ProviderProfile />} />
        <Route path="/profile/client" element={<ClientProfile />} />
      </Routes>
    </div> </ErrorBoundary>
  );
}

export default App;
