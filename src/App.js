import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Properties from "./components/properties";
import Property from "./components/property";
import { createContext, useState } from "react";
import { sessionStorage as storage } from "js-storage";
import BlankPage from "./components/404";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

export const PropertyContext = createContext([]);
export const BuyerInfoContext = createContext();

function App() {
  const [properties, setProperties] = useState(storage.get("properties") || []);
  const [buyerInfo, setBuyerInfo] = useState(
    storage.get(["name", "email", "propertyAddress"])
  );

  return (
    <BrowserRouter>
      <PropertyContext.Provider
        value={{ value: properties, handler: setProperties }}
      >
        <BuyerInfoContext.Provider
          value={{ value: buyerInfo, handler: setBuyerInfo }}
        >
          <Routes>
            <Route exact path="/property" element={<Property />} />
            <Route exact path="/properties" element={<Properties />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Register />} />
            <Route exact path="/" element={<Home />} />
            <Route path="/:id?" element={<BlankPage />} />
          </Routes>
        </BuyerInfoContext.Provider>
      </PropertyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
