import { useState } from "react";
import LoginPage from "./pages/Login";
import ProductPage from "./pages/Product";



function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {isAuth ? (
        <ProductPage setIsAuth={setIsAuth} />
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
