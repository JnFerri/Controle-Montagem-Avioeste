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
  const [EscritaBotao, setEscritaBotao] = useState('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')
  const [VisualizacaoForm, setVisualizacaoForm] = useState(false)
  const [EscritaBotaoForm , setEscritaBotaoForm] = useState('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
   async  function PegarOrdens(){
        const ordensNaoFinalizadas = await PegarOrdensNaoFinalizadas('fk0lbipncnh3mu7u95dls')
        setOrdens(ordensNaoFinalizadas)
        if(PostOrdens === false){
          setPostOrdens(true)
          setEscritaBotao('ESCONDER AS ORDENS EM ANDAMENTO')
        }else{
          setPostOrdens(false)
          setEscritaBotao('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')
        }
   }

   async function ApareceEscondeFormNovaOrdem(){
    if(VisualizacaoForm === false){
      setVisualizacaoForm(true)
      setEscritaBotaoForm('CANCELAR')
    }else{
      setVisualizacaoForm(false)
      setEscritaBotaoForm('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
    }
   }
   
  return (
    <div className="App">
     <Header></Header>
     {VisualizacaoForm === true ? <div><Botao onClick={ApareceEscondeFormNovaOrdem} width='30%' border='solid 0.5px black' boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' borderRadius='5px' margin='5px 0px' color='black' backgroundcolor='#e3934d' fontSize='20px'>{EscritaBotaoForm}</Botao> <FormInputOP setOrdens= {setOrdens} ordens= {Ordens}></FormInputOP></div> : <Botao onClick={ApareceEscondeFormNovaOrdem} width='30%' boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' border='solid 0.5px black' padding='10px 5px' borderRadius='5px' margin='5px 0px' backgroundcolor='#468de3' fontSize='24px'>{EscritaBotaoForm}</Botao> }
    <Botao onClick={PegarOrdens} width='30%' border='solid 0.5px black' boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' borderRadius='5px' margin='5px 0px' backgroundcolor='#468de3' fontSize='24px'>{EscritaBotao}</Botao>
    {PostOrdens && <OrdensLista ordens={Ordens} setOrdens = {setOrdens}/>}
    </div>
  );
}

export default App;
