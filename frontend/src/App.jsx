import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import React from 'react';
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";


function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App