import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedPage from "./Components/ProtectedPage";
import "remixicon/fonts/remixicon.css";
import Spinner from "./Components/Spinner";
import { useSelector } from "react-redux";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin";
import ProductInfo from "./Pages/ProductInfo";
import DarkMode from "./Components/Darkmode";

function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <DarkMode>
    {({ isDarkMode, toggleDarkMode }) => (
      <div>
        {loading && <Spinner />}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedPage
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Home
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedPage>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedPage
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <ProductInfo
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedPage
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Profile
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedPage>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedPage
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                >
                  <Admin
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedPage>
              }
            />
            <Route
              path="/login"
              element={<Login isDarkMode={isDarkMode} />}
            />
            <Route
              path="/register"
              element={<Register isDarkMode={isDarkMode} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    )}
  </DarkMode>
  );
}

export default App;
