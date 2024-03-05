import './App.css';
import Header from './Components/Header/Header.js';
import FormInputOP from './Components/FormInputOrdem/FormInputOrdem.js';
import OrdensLista from './Components/OrdensLista/OrdensLista.js';
import { useState } from "react";
import Botao from './Components/Botao/Botao.js';
import { PegarOrdensNaoFinalizadas } from './Services/PegarOrdensNaoFinalizadas.js';


function App() {
  const [Ordens, setOrdens] = useState([])
  const [PostOrdens,setPostOrdens] = useState(false)
  const [EscritaBotao, setEscritaBotao] = useState('Clique para Mostrar as Ordens')
   async  function PegarOrdens(){
        const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
        setOrdens(ordensNaoFinalizadas)
        if(PostOrdens === false){
          setPostOrdens(true)
          setEscritaBotao('Clique para Esconder as Ordens')
        }else{
          setPostOrdens(false)
          setEscritaBotao('Clique para Mostrar as Ordens')
        }
   }

  return (
    <div className="App">
     <Header></Header>
     <FormInputOP setOrdens= {setOrdens}></FormInputOP>
    <Botao onClick={PegarOrdens} width='30%' border='solid 0.5px black' padding='10px 5px' borderRadius='5px' margin='5px 0px'>{EscritaBotao}</Botao>
    {PostOrdens && <OrdensLista ordens={Ordens} setOrdens = {setOrdens}/>}
    </div>
  );
}

export default App;
