import Modal from 'react-modal';
import Label from '../../Label/Label.js';
import Imagem from '../../Imagem/Imagem.js';
import Input from '../../Input/Input.js';
import Botao from '../../Botao/Botao.js';
import loadingImg from "../../../images/tube-spinner.svg";
import { OrdensController } from '../../../Controller/OrdensController.js';
import tranformarDataEmString from '../../../Helpers/tranformarDataEmString.js';
import Delay from '../../../Helpers/Delay.js';
import { useState } from 'react';

/**
 * Instancia de OrdensController.
 * @instance
 */
const ordensController = new OrdensController()

/**
 * Estado que guarda informação da quantidade produzida.
 * @typedef {EstadoReact} QuantidadeProduzida
 * @property {number} QuantidadeProduzida Estado que guarda o valor do input de quantidade produzida.
 * @property  {React.Dispatch<React.SetStateAction<number>>} setQuantidadeProduzida Função que define novo valor para o estado QuantidadeProduzida.
  */

/**
 * Estado que define a visualização do componente de loading.
 * @typedef {EstadoReact} LoadingFinalizacao
 * @property {boolean} LoadingFinalizacao True define o loading como visivel, false oculta ele.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setLoadingFinalizacao Função que define o estado de LoadingFinalizacao.
 */

/**
 * Componente modal para finalizar a ordem e capturar algumas informações referentes a finalização.
 * @param {Object} props Props do componente.
 * @param {boolean} props.ModalQuantidadeFinalizacao Estado que define a visualização do modal.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setModalQuantidadeFinalizacao Função que define o valor do estado ModalQuantidadeFinalizacao.
 * @param {React.Dispatch<React.SetStateAction<Array<Object>>>} props.setLocalStorage Função que define novo valor para o estado LocalStorage.
 * @param {Object} props.Ordemfinalizar Estado que guarda a informação da ordem a qual esta sendo finalizada.
 * @returns {JSX.Element} Componente de modal para pegar informações referentes a finalização de ordem da lista.
 */
function ModalFinalizar({ModalQuantidadeFinalizacao, setModalQuantidadeFinalizacao, setLocalStorage, OrdemFinalizar }){

    /**
     * Estado que guarda o valor de quantidade produzida.
     */
  const [QuantidadeProduzida, setQuantidadeProduzida] = useState(0)
    /**
     * Estado que define a visualização do componente loading ao finalizar a ordem.
     */
  const [LoadingFinalizacao, setLoadingFinalizacao] = useState(false)

  /**
   * Função que finaliza a ordem, Pega as informações da ordem da localstorage de ordensNaoFinalizadas e pausasOrdens, adiciona alguns dados a elas e envia ao servidor para ser salvado todos os dados no jestor.
   * @param {Object} ordem Estado OrdemFinalizar que possui os dados da ordem que esta sendo finalizada.
   * @throws {Error} Erro quando não encontrado a ordem na localstorage.
   * @throws {Error} Erro quando não é possivel salvar os dados das pausas no jestor. Não impede de salvar os dados da ordem. 
   */
  async function HandleFinalizar(ordem){
    if(QuantidadeProduzida > 0){
        const horarioFinalizacao = new Date()
        const horarioInicio = new Date(Date.parse(ordem.horario_inicio) + 10800000)
        const ordensLocalStorage = await JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
        const pausasLocalStorage = await  JSON.parse(localStorage.getItem('pausasOrdens')) || [];
        const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
        const pausasAtualIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id);

        // Define ou altera os valores de tempo_em_producao , tempo_total_producao , status , quantidade_produzida e horario_termino da ordem e depois através da função criarRegistro do controller envia os dados ao servidor para serem salvos no jestor.
        if(ordem.status === 'Em Andamento'){
            if (ordemAtualIndex !== -1) {
                setLoadingFinalizacao(true)
                const tempoTotalMilisegundos = horarioFinalizacao - horarioInicio
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                if(ordem.qnt_pausado > 0){
                    ordemAtual['tempo_em_producao'] = tempoTotalMilisegundos - ordem.qnt_pausado
                }else{
                    ordemAtual['tempo_em_producao'] = tempoTotalMilisegundos
                }
                ordemAtual['tempo_total_producao'] = tempoTotalMilisegundos
                ordemAtual['finalizado'] = true
                ordemAtual['status'] = 'Finalizado'
                ordemAtual['quantidade_produzida'] = QuantidadeProduzida
                ordemAtual['horario_termino'] = tranformarDataEmString(horarioFinalizacao)
                const result = await ordensController.criarRegistro(process.env.REACT_APP_TABELA, ordemAtual)
                if(result.error){
                    window.alert(`${result.error}  , Contate o administrador do sistema para saber o real motivo e pedir confirmação para excluir a ordem.`)
                    console.log(result)
                    setModalQuantidadeFinalizacao(false)
                    setQuantidadeProduzida(0)
                    setLoadingFinalizacao(false)
                }else {
                    ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                    ordensLocalStorage.splice(ordemAtualIndex, 1);
                    localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                    await Delay(1000)
                    setLocalStorage(ordensLocalStorage)
                    
                    // Salva no jestor os dados das pausas da localstorage 'pausasOrdens' referentes a ordem que esta sendo finalizada.
                    if(pausasLocalStorage){
                    if(pausasLocalStorage.length > 0){

                        if(pausasLocalStorage[pausasAtualIndex].pausas.length > 0){
                            pausasLocalStorage[pausasAtualIndex].pausas.forEach( async (pausa) => {
                                const obj = {
                                    conexao_apontamentos_2:result.data[`id_${process.env.REACT_APP_TABELA}`],
                                    ordem_producao:pausa.ordem_producao,
                                    motivo_pausa:pausa.motivo_pausa,
                                    tempo_pausado:pausa.tempo_pausado,
                                    motivo_retrabalho: pausa.motivo_retrabalho
                                }
                                const resultado = await ordensController.criarRegistro(process.env.REACT_APP_TABELA_PAUSAS, obj)
                                if(resultado.error){
                                    throw new Error('Atenção não foi possivel Salvar os dados das pausas, contate o administrador do sistema.', resultado.error)
                                }
                            })
                            pausasLocalStorage.splice(pausasAtualIndex, 1)
                            localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                        }
                    }
                  }
                    

                    setModalQuantidadeFinalizacao(false)
                    setQuantidadeProduzida(0)
                    setLoadingFinalizacao(false)
                    
                }
            }else {
                throw new Error('Ordem não encontrada na localStorage.');
            }
        }else{
            window.alert("Coloque a ordem em andamento antes de finalizar")
        }
    }else{
        window.alert('Favor informar a quantidade produzida !!')
    }
}

/**
 * Define o estado QuantidadeProduzida conforme o valor que está no input.
 * @param {*} event Evento onChange do input.
 */
  const HandleQuantidadeProduzida = (event) => {
    setQuantidadeProduzida(event.target.value);
  };

    return(
        <Modal
    isOpen={ModalQuantidadeFinalizacao}
    onRequestClose={async() => setModalQuantidadeFinalizacao(false)}
    contentLabel="Motivo da Pausa"
    ariaHideApp={false}
    style={{
        overlay: {
          backgroundColor: 'rgba(0, 0 ,0, 0.8)'
        },
        content: {
          border: '1px solid black',
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          display:'flex',
          flexDirection: "column",
          alignItems:'center'
        }
      }}
    >
      <Label>Quantas peças foram produzidas ?</Label>
      {LoadingFinalizacao ? (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
      <Imagem src={loadingImg} width='20%'></Imagem> 
      <span>Finalizando...</span>
      </div>
      )
      : 
      (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
      <Input placeholder="Quantidade Produzida"   padding = "20px 0px" width="40%" margin ="1rem 0px" border_radius="20px" border='0.1px black solid' font_size="20px" value={QuantidadeProduzida} onChange={HandleQuantidadeProduzida}></Input>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandleFinalizar(OrdemFinalizar)}>FINALIZAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalQuantidadeFinalizacao(false)}>CANCELAR</Botao>
      </div>
      )
      }
    </Modal>
    )
}

export default ModalFinalizar