import './scss/style.scss';
import React from 'react';
import {BrowserRouter,Route} from "react-router-dom";
import Login from "./routes/Login"

function App(){
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={Login}></Route>
    </BrowserRouter>
    );
}

export default App;