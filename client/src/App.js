import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedPage from "./Components/ProtectedPage";
import 'remixicon/fonts/remixicon.css';
import Spinner from "./Components/Spinner";
import { useSelector } from "react-redux";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin";
import ProductInfo from "./Pages/ProductInfo";

function App() {
  const {loading}=useSelector(state=>state.loaders);
  return (
    <div >
      <div>
        {loading && <Spinner/>}
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedPage><Home/></ProtectedPage>} />
          <Route path="/product/:id" element={<ProtectedPage><ProductInfo/></ProtectedPage>} />
          <Route path="/profile" element={<ProtectedPage><Profile/></ProtectedPage>} />
          <Route path="/admin" element={<ProtectedPage><Admin/></ProtectedPage>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

        </Routes>
        
        
        </BrowserRouter>
      
      </div>
      
    </div>
    
  );
}

export default App;
