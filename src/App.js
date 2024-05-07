import './App.css';
import Header from './Components/Header/Header.js';
//import FormInputOP from './Components/FormInputOrdem/FormInputOrdem.js';
//import OrdensLista from './Components/OrdensLista/OrdensLista.js';
//import { useEffect, useState } from "react";
//import Botao from './Components/Botao/Botao.js';
import Login from './Components/Login/Login.js';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ControleProducao from './Paginas/ControleProducao.js';
import { useEffect, useState } from 'react';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.js';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';


function App() {
  const [LoginConferencia, setLoginConferencia] = useState(false)
  const [LoginLocalStorage, setLoginLocalStorage] = useState(JSON.parse(localStorage.getItem('Login')) || [])
  
  useEffect(() => {
    async function confereLoginLocalStorage(){
      const loginStorage = JSON.parse(localStorage.getItem('Login'))
      if(loginStorage){
        await fetch('http://srv-services:3000/autorizacao/controleMontagem',{ method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body : JSON.stringify({ usuario : loginStorage.Usuario, senha: loginStorage.Senha  })
        
    }).then(response => response.json())
    .then(data => {
      if(data === true) {
        setLoginConferencia(true)
      }else{
        setLoginConferencia(false)
        window.alert('Login incorreto, caso esqueceu a senha contatar o administrador.')
      }
    });
      }
      }
    confereLoginLocalStorage()
  },[setLoginConferencia, LoginLocalStorage])


   const todosOsDadosLogin = {
    setLoginConferencia,setLoginLocalStorage,LoginConferencia,LoginLocalStorage
   }

   function shouldForwardProp(propName, target) {
    if (typeof target === "string") {
        // For HTML elements, forward the prop if it is a valid HTML attribute
        return isPropValid(propName);
    }
    // For other elements, forward all props
    return true;
  }
   
  return (
    <div className="App">
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    {
      LoginConferencia === true ? <Header></Header>: ''
     }
     <BrowserRouter>
       <Routes>
         <Route path="/"  element={<Login todosOsDadosLogin={{...todosOsDadosLogin}} />} />
         <Route path="/controleProducao" element={<ProtectedRoute component={ControleProducao} isAuthenticated={LoginConferencia} />} />
  
         {/* Outras rotas protegidas */}
       </Routes>
     </BrowserRouter>
     </StyleSheetManager>
   </div>
  );
}

export default App;
