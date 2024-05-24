
import Modal from 'react-modal';
import Botao from '../../Botao/Botao.js';
import Select from '../../Select/Select.js';
import Option from '../../Select/Option/Option.js';
import Titulo2 from '../../Titulo2/Titulo2.js';
import motivosRetrabalho from "../../../BD/motivosRetrabalho.js";
import motivosPausas from "../../../BD/motivosPausas.js";
import React, { useState } from 'react';
import tranformarDataEmString from '../../../Helpers/tranformarDataEmString.js';

/**
 * Estado que guarda o motivo da pausa.
 * @typedef {EstadoReact} MotivoPausa
 * @property {string} MotivoPausa Guarda o valor do select de motivo da pausa.
 * @property {React.Dispatch<React.SetStateAction<string>>} setMotivoPausa Função que define novo valor para o estado MotivoPausa.
 */

/**
 * Estado que guarda o motivo do retrabalho quando este for o motivo de pausa.
 * @typedef {EstadoReact} MotivoRetrabalho
 * @property {string} MotivoRetrabalho Guarda o valor do select de motivo de retrabalho.
 * @property {React.Dispatch<React.SetStateAction<string>>} setMotivoRetrabalho Função que define novo valor para o estado MotivoRetrabalho.
 */

/**
 * Componente modal visualizado quando clicado para pausar um componente, utilizado para pegar o motivo da pausa e motivo do retrabalho.
 * @param {Object} props Props do componente.
 * @param {boolean} props.ModalPausa Estado que define a visualização do modal, proveniente do componente OrdensLista.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setModalPausa Função que define novo valor para o estado ModalPausa.
 * @param {Object} props.OrdemPausada Ordem a qual o modal se refere.
 * @param {React.Dispatch<React.SetStateAction<Array<Object>>>} props.setLocalStorage Função que define novo valor para o estado LocalStorage.
 * @returns {JSX.Element} 
 */
function ModalPausaComponent({ModalPausa, setModalPausa, OrdemPausada, setLocalStorage}){
  /**
   * Estado que guarda o valor do select de motivo da pausa.
   */
  const [MotivoPausa, setMotivoPausa] = useState('')

  /**
   * Estado que guarda o valor do select de motivo de retrabalho.
   */
  const [MotivoRetrabalho, setMotivoRetrabalho] = useState('')

  /**
   * Define estado MotivoPausa com o valor do select de motivo pausa.
   * @param {*} event Evento onChange do componente.
   */
  function HandleMotivo(event){
    setMotivoPausa(event.target.value)
    }
    
    /**
     * Define estado MotivoRetrabalho com o valor do select de motivo retranalho.
     * @param {*} e Evento onChange do componente 
     */
    const HandleMotivoRetrabalho = (e) => {
      setMotivoRetrabalho(e.target.value)
  }

  /**
   * Adiciona os valores de horario_pausa e altera os valores de motivos_das_pausas adicionando o motivo da pausa atual e altera o status para pausado da ordem na localstorage de 'ordensNaoFinalizadas'.
   * Adiciona os dados da pausa no localstorage de pausasOrdens.
   * @param {Object} ordem Estado OrdemPausada que possui os dados da ordem a qual será feito a pausa. 
   * @throws {Error} Erro quando a ordem não é encontrada na localstorage.
   */
  function HandlePausa(ordem){
    try{
      // Define e altera os valores da ordem na localstorage ordensNaoFinalizadas adicionando os dados da pausa.
        if(ordem.status === 'Em Andamento' ){
         if(MotivoPausa !== ''){
            if(MotivoPausa === 'Retrabalho' && MotivoRetrabalho === ''){
                window.alert('Por favor preencha um motivo para o retrabalho !!')
            }else {
                const horarioPausa = new Date()
                const dataPausaJestor = tranformarDataEmString(horarioPausa)
                const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
                const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);
                if (ordemAtualIndex !== -1) {
                    const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                    ordemAtual['horario_pausa'] = dataPausaJestor;
                    ordemAtual['motivos_das_pausas'] = ordemAtual['motivos_das_pausas'] ? `${ordem.motivos_das_pausas} , ${MotivoPausa}` : `${MotivoPausa}`;
                    ordemAtual['status'] = 'Pausado';
                    ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                    localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                    setLocalStorage(ordensLocalStorage)
                    setModalPausa(false)
   
                    // Adiciona os valores da pausa referente a ordem na localstorage de pausasOrdens.
                    const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
                    const pausasLocalStorageIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id)
                    
                    if (pausasLocalStorageIndex !== -1){
                        const obj = {ordem_producao:ordensLocalStorage[ordemAtualIndex]['ordem_producao'],motivo_pausa:MotivoPausa, motivo_retrabalho : MotivoRetrabalho }
                        pausasLocalStorage[pausasLocalStorageIndex].pausas.push(obj)
                        localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                    }else{
                       const obj = {id:ordem.id, pausas: [{ ordem_producao:ordensLocalStorage[ordemAtualIndex]['ordem_producao'],motivo_pausa:MotivoPausa, motivo_retrabalho : MotivoRetrabalho }] }
                       pausasLocalStorage.push(obj)
                       localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                    }
                    setMotivoPausa('')
                    setMotivoRetrabalho('')
   
                }else {
                    throw new Error('Ordem não encontrada na localStorage.');
                }
            }
         }else {
            window.alert('Por favor preencha um motivo para a pausa !!')
         }
        }
        
    }catch (error) {
        console.error('Erro ao atualizar o estado das ordens:', error);
    }
    }

    return(

<Modal 
    isOpen={ModalPausa}
    onRequestClose={async() => setModalPausa(false)}
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
      <Titulo2>COLOQUE O MOTIVO DA PAUSA:</Titulo2>
      <Select onChange={HandleMotivo} margin='30px 0px' padding='20px 0px' width='80%' font_size='24px'>
      <Option width='80%' padding='20px 0px' font_size='24px' value=''>Selecione um Motivo...</Option>
        {
            motivosPausas.map((motivos,index) => (
                <Option width='80%' padding='20px 0px' font_size='24px' key={index}>{motivos}</Option>
            ))
        }
      </Select>
      {
        MotivoPausa === 'Retrabalho' ? 
        <Select onChange={HandleMotivoRetrabalho} margin='30px 0px' padding='20px 0px' width='80%' font_size='24px'>
      <Option width='80%' padding='20px 0px' font_size='24px' value=''>Selecione um Motivo do Retrabalho...</Option>
        {
            motivosRetrabalho.map((motivos,index) => (
                <Option width='80%' padding='20px 0px' font_size='24px' key={index}>{motivos}</Option>
            ))
        }
      </Select>
      :
      ''
      }
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#79b3e0' border_radius='30px' onClick={() => HandlePausa(OrdemPausada)}>ENVIAR</Botao>
      <Botao padding='20px 10px' width='40%' margin='1rem 0' border='1px solid black' backgroundcolor='#FF6347' border_radius='30px' onClick={() => setModalPausa(false)}>CANCELAR</Botao>
      
    </Modal>
    )
}

export default ModalPausaComponent