import { useEffect, useState } from "react"
import OrdensLista from "../Components/OrdensLista/OrdensLista.js"
import Botao from "../Components/Botao/Botao.js"
import FormInputOP from "../Components/FormInputOP/FormInputOP.js"
import styled from "styled-components"

/**
 * Style-Component simples de div para servir de container dos outros componentes de ControleProducao.
 */
const ControleContainer = styled.div`
display: flex;
flex-direction: column;
width:100%;
align-items:center;
`

/**
 * Estado que define o estado da visualização do componente FormInputOP no componente ControleProducao.
 * @typedef {EstadoReact} VisualizacaoForm 
 * @property {boolean} VisualizacaoForm True o Formulario esta visivel, False não esta.
 */

/**
 * Estado que define o que sera escrito no botão que oculta ou mostra o formulario.
 * @typedef {EstadoReact} EscritaBotaoForm 
 * @property {string} EscritaBotaoForm O que será escrito no botão, utilizado 'ADICIONAR NOVA ORDEM DE PRODUÇÃO' ou 'CANCELAR'.
 */

/**
 * Estado que guarda os dados do banco de dados 'ordensNaoFinalizadas' da localstorage.
 * @typedef {EstadoReact} LocalStorage
 * @property {Array<Object>} LocalStorage Array de objetos contendo as informações das ordensNãoFinalizadas do localstorage. 
 */

/**
 * Estado que guarda a informação das ordens que devem aparecer na lista, Sempre será o mesmo valor que o estado LocalStorage. Possui useEffect que define seu valor automaticamente quando alterado o estado LocalStorage.
 * @typedef {EstadoReact} Ordens
 * @property {Array<Object>} Ordens Dados do estado LocalStorage. 
 */

/**
 * Estado que guarda o estado da visualização do componente ordensLista.
 * @typedef {EstadoReact} VisualizacaoOrdens
 * @property {boolean} VisualizacaoOrdens true a lista de ordens esta visivel, false não esta.
 */

/**
 * Estado que define o que será escrito no botão que oculta ou mostra a lista de ordens.
 * @typedef {EstadoReact} EscritaBotao
 * @property {string} EscritaBotao O que será escrito no botão, utilizado 'MOSTRAR TODAS AS ORDENS EM ANDAMENTO' ou 'ESCONDER AS ORDENS EM ANDAMENTO'.
 */

/**
 * Componente de pagina principal, Engloba os componentes principais de FormInputOP e ordensLista com botões que definem suas vizualizações.
 * @returns {JSX.Element} Componente React de ControleProducao.
 */
function ControleProducao(){
    
  /**
   * Estado React que define se o formulario esta visivel ou não.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
    const [VisualizacaoForm, setVisualizacaoForm] = useState(false)

    /**
   * Estado que define o que sera escrito no botão que oculta ou mostra o formulario.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
    const [EscritaBotaoForm , setEscritaBotaoForm] = useState('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
    
    /**
   * Estado que guarda os valores da localstorage de ordensNaoFinalizadas
   * @type {[Array, React.Dispatch<React.SetStateAction<Array>>]}
   */
    const [LocalStorage,setLocalStorage] = useState([])
    
    /**
   * Estado que guarda as ordens que devem aparecer na lista.
   * @type {[Array, React.Dispatch<React.SetStateAction<Array>>]}
   */
    const [Ordens, setOrdens] = useState(LocalStorage)
    
    /**
   * Estado que define se a lista de ordens esta visivel ou não.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
    const [VisualizacaoOrdens,setVisualizacaoOrdens] = useState(false)
   
    /**
   * Estado que define o que sera escrito no botão que oculta ou mostra a lista de ordens.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
    const [EscritaBotao, setEscritaBotao] = useState('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')

   /**
    * Altera a visualização do formulário e o que será escrito no botão através dos estados VisualizacaoForm e EscritaBotaoForm.
    */
    async function ApareceEscondeFormNovaOrdem(){
        if(VisualizacaoForm === false){
          setVisualizacaoForm(true)
          setEscritaBotaoForm('CANCELAR')
        }else{
          setVisualizacaoForm(false)
          setEscritaBotaoForm('ADICIONAR NOVA ORDEM DE PRODUÇÃO')
        }
       }

      /**
       * Altera a visualização da lista de ordens e o que será escrito no botão através dos estados VisualizacaoOrdens e EscritaBotao.
       */
    async function PegarOrdens(){
        setLocalStorage(JSON.parse(localStorage.getItem('ordensNaoFinalizadas') || "[]"))
        if(VisualizacaoOrdens === false){
          setVisualizacaoOrdens(true)
          setEscritaBotao('ESCONDER AS ORDENS EM ANDAMENTO')
        }else{
          setVisualizacaoOrdens(false)
          setEscritaBotao('MOSTRAR TODAS AS ORDENS EM ANDAMENTO')
        }
   }

      /**
        * Sempre que LocalStorage mudar define Ordens com o mesmo valor para manter a lista de ordens exibidas com os dados das ordens não finalizadas.
        */
    useEffect(() => {
        setOrdens(LocalStorage); 
      },[LocalStorage])

    return(
    <ControleContainer>

      <Botao 
      onClick={ApareceEscondeFormNovaOrdem} 
      width='30%' 
      border='solid 0.5px black' 
      boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' 
      padding='10px 5px' 
      border_radius='5px' 
      margin='5px 0px' 
      color='black' 
      backgroundcolor={VisualizacaoForm ? '#e3934d' :  '#468de3' }
      font_size='24px'>
      {EscritaBotaoForm}
      </Botao> 
      {VisualizacaoForm === true ? 
      <FormInputOP LocalStorage={LocalStorage} setLocalStorage={setLocalStorage} ordens= {Ordens}></FormInputOP>
      : 
      ''
      }
  <Botao 
  onClick={PegarOrdens} 
  width='30%' 
  border='solid 0.5px black' 
  boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' 
  padding='10px 5px' 
  border_radius='5px' 
  margin='5px 0px' 
  backgroundcolor='#468de3' 
  font_size='24px'>
    {EscritaBotao}
    </Botao>
  {VisualizacaoOrdens && <OrdensLista ordens={Ordens}  setOrdens = {setOrdens} setLocalStorage={setLocalStorage}/>}
    </ControleContainer>
    
    )
}

export default ControleProducao