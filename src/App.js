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


function App() {
  //const [LocalStorage,setLocalStorage] = useState([])
  //const [Ordens, setOrdens] = useState(LocalStorage)
  //const [PostOrdens,setPostOrdens] = useState(false)
  //const [EscritaBotao, setEscritaBotao] = useState('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')
  //const [VisualizacaoForm, setVisualizacaoForm] = useState(false)
  //const [EscritaBotaoForm , setEscritaBotaoForm] = useState('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
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
      console.log(data)
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

   
  
  /*useEffect(() => {
    setOrdens(LocalStorage); // Defina o estado `Ordens` com os dados recuperados da localStorage ou um array vazio se não houver dados
  },[LocalStorage])*/

   /*async  function PegarOrdens(){
        setLocalStorage(JSON.parse(localStorage.getItem('ordensNaoFinalizadas') || "[]"))
        //setOrdens(localStorage.getItem('ordensNaoFinalizadas'))
        if(PostOrdens === false){
          setPostOrdens(true)
          setEscritaBotao('ESCONDER AS ORDENS EM ANDAMENTO')
        }else{
          setPostOrdens(false)
          setEscritaBotao('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')
        }
   }*/

   /*async function ApareceEscondeFormNovaOrdem(){
    if(VisualizacaoForm === false){
      setVisualizacaoForm(true)
      setEscritaBotaoForm('CANCELAR')
    }else{
      setVisualizacaoForm(false)
      setEscritaBotaoForm('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
    }
   }*/

   const todosOsDadosLogin = {
    setLoginConferencia,setLoginLocalStorage,LoginConferencia,LoginLocalStorage
   }
   
  return (
   /* LoginConferencia === true ?
    <div className="App">
     <Header></Header>
     {VisualizacaoForm === true ? <div><Botao onClick={ApareceEscondeFormNovaOrdem} width='30%' border='solid 0.5px black' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' margin='5px 0px' color='black' backgroundcolor='#e3934d' font_size='20px'>{EscritaBotaoForm}</Botao> <FormInputOP setOrdens= {setOrdens} LocalStorage={LocalStorage} setLocalStorage={setLocalStorage} ordens= {Ordens}></FormInputOP></div> : <Botao onClick={ApareceEscondeFormNovaOrdem} width='30%' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' border='solid 0.5px black' padding='10px 5px' border_radius='5px' margin='5px 0px' backgroundcolor='#468de3' font_size='24px'>{EscritaBotaoForm}</Botao> }
    <Botao onClick={PegarOrdens} width='30%' border='solid 0.5px black' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' margin='5px 0px' backgroundcolor='#468de3' font_size='24px'>{EscritaBotao}</Botao>
    {PostOrdens && <OrdensLista ordens={Ordens}  setOrdens = {setOrdens} setLocalStorage={setLocalStorage}/>}
    </div> 
    :
    <div className="App">
     <Header></Header>
     <Login setLoginConferencia = {setLoginConferencia}></Login>
    </div> */
    <div className="App">
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
   </div>
  );
}

export default App;
