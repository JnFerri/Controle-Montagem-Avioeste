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

/**
 * Estado de login conferido.
 * @typedef {EstadoReact} LoginConferencia 
 * @property {boolean} LoginConferencia - Indica se o login foi conferido.
 */

/**
 * Estado React que guarda os dados de Login do localstorage.
 * @typedef {EstadoReact} LoginLocalStorage
 * @property {Array<Object>} LoginLocalStorage- Dados do banco de dados localstorage 'Login'
 */


/**
 * Componente principal APP, utiliza react-router.
 * @returns {JSX.Element}
 * @example
 * 
 */

function App() {

  /**
   * Estado React que guarda informação se o usuario esta logado ou não.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [LoginConferencia,setLoginConferencia] = useState(false)
  /**
   * Estado que indica se o login foi conferido.
   * @type {[Array<Object>, React.Dispatch<React.SetStateAction<Array<Object>>>]}
   */
  const [LoginLocalStorage, setLoginLocalStorage] = useState(JSON.parse(localStorage.getItem('Login')) || [])
  
  /**
   * Ao carregar a pagina ou alterar o valor do estado LoginLocalStorage envia as informações do login do localStorage para o servidor com metodo post, caso seja iguais as informações de login no servidor retorna true ou false e define o estado de LoginConferencia.
   */
  useEffect(() => {
    async function confereLoginLocalStorage(){
      const loginStorage = JSON.parse(localStorage.getItem('Login'))
      if(loginStorage){
        await fetch(`${process.env.REACT_APP_API_URL}/autorizacao/controleMontagem`,{ method: 'POST',
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

  /**
   * Props de Login
   */
   const todosOsDadosLogin = {
    setLoginConferencia,setLoginLocalStorage,LoginConferencia,LoginLocalStorage
   }

   /**
    * Verifica se todas as props dos componentes utilizadas no styled-components são validas para evitar avisos no console.
    */
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
       </Routes>
     </BrowserRouter>
     </StyleSheetManager>
   </div>
  );
}

export default App;
