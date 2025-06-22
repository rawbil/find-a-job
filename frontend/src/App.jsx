import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import UserProfile from "./Pages/Profile/Profle";
import ProfileDisplay from "./Pages/ProfileDisplay/ProfileDisplay";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile-display" element={<ProfileDisplay />} />
      </Routes>
    </div>
  );
}

export default App;
