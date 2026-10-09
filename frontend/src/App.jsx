import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MyLinks from "./pages/MyLinks";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter basename="/shortener">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/links"
          element={<MyLinks />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route
          path="/profile"
          element={<Profile></Profile>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
