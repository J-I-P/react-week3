import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import LoginPage from "./pages/Login";
import ProductPage from "./pages/Product";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;



function App() {
  const [isAuth, setIsAuth] = useState(false);



  return (
    <>
      {isAuth ? <ProductPage setIsAuth={setIsAuth}/> : <LoginPage setIsAuth={setIsAuth}/>}


    </>
  );
}

export default App;