import styled from "styled-components";
import Titulo4 from "../Titulo4/Titulo4.js";
import Botao from "../Botao/Botao.js";
//import { PegarOrdensNaoFinalizadas } from "../../Services/PegarOrdensNaoFinalizadas.js";
import { useState } from "react";
import Imagem from "../Imagem/Imagem.js";
import ImagemEditar from "../../images/caneta.png"
import ModalFinalizar from "./ModalFinalizar/ModalFinalizar.js";
import ModalPausaComponent from "./ModalPausaComponent/ModalPausaComponent.js";
import ModalEditar from "./ModalEditar/ModalEditar.js";
import tranformarDataEmString from "../../Helpers/tranformarDataEmString.js";


/**
 * Componente section para servir de container dos outros componentes.
 */
const ContainerOrdens = styled.section`
    width:90%;
    background-color:white;
    border-radius:30px;
    display: flex;
    flex-direction:column;
    align-items:center;
`

/**
 * Componente de Lista.
 */
const OrdensUl = styled.ul`
    display:flex;
    align-items:center;
    justify-content:center;
    width: 95%;
    flex-direction:column;
    padding-inline-start: 0px;
    text-align:center;

`

/**
 * Componente linha da lista.
 */
const OrdensLi = styled.li`
    width: 100%;
    display:flex;
    align-items:center;
    padding:20px 10px;
    border:solid 0.5px black;
    border-radius:15px;
    margin:4px 4px;
    background-color: ${props => props.backgroundcolor || 'white'};


`
/**
 * Componente utilizado para englobar informações das ordens.
 */
const ItemLista = styled.div`
    width:25%;
    padding: 5px 5px;
    display:flex;
    flex-direction:column;
    align-items:center; 
    `

/**
 * Componente onde o dado referente a ordem é escrito.
 */
const SpanOrdem = styled.span`
    font-size : 18px;
    color: white;
    background-color:black;
    width:100%;
    border-radius: 0px 0px 5px 5px;
    margin:0px 3px;


`

/**
 * Componente div para englobar componentes em linha alinhados na horizontal.
 */
const DivLinha = styled.div`
    display:flex;
    align-items:center;
    width:100%;
    justify-content:center;

`

/**
 * Estado que define a visualização do Componente ModalPausaComponent. 
 * @typedef {EstadoReact} ModalPausa
 * @property {boolean} ModalPausa True aparecerá o modal de Pausa, false ocultará ele.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setModalPausa Função que define novo valor para o estado ModalPausa.
 */

/**
 * Estado que ao clicar para abrir modal de pausa, guarda informações da ordem clicada para utilizar no modal.
 * @typedef {EstadoReact} OrdemPausada
 * @property {Object} OrdemPausada Objeto contendo os dados da ordem clicada para pausar.
 * @property {React.Dispatch<React.SetStateAction<Object>>} setOrdemPausada Função que define novo valor para OrdemPausada.
 */

/**
 * Estado que define a visualização do Componente ModalEditar. 
 * @typedef {EstadoReact} ModalEdicao
 * @property {boolean} ModalEdicao True aparecerá o modal de Edição, false ocultará ele.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setModalEdicao Função que define novo valor para o estado ModalEdicao.
 */

/**
 * Estado que ao clicar para abrir modal de edição, guarda informações da ordem clicada para utilizar no modal.
 * @typedef {EstadoReact} OrdemEditando
 * @property {Object} OrdemEditando Objeto contendo os dados da ordem clicada para editar.
 * @property {React.Dispatch<React.SetStateAction<Object>>} setOrdemEditando Função que define novo valor para OrdemEditando.
 */

/**
 * Estado que define a visualização do componente ModalFinalizar.
 * @typedef {EstadoReact} ModalQuantidadeFinalizacao
 * @property {boolean} ModalQuantidadeFinalizacao True aparecerá o modal de Finalização da ordem, false ocultará ele.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setModalQuantidadeFinalizacao Função que define novo valor para o estado ModalQuantidadeFinalizacao.  
*/

/**
 * Estado que ao clicar para abrir modal de finalização, guarda informações da ordem clicada para utilizar no modal.
 * @typedef {EstadoReact} OrdemFinalizar
 * @property {Object} OrdemFinalizar Objeto contendo os dados da ordem clicada para finalizar.
 * @property {React.Dispatch<React.SetStateAction<Object>>} setOrdemFinalizar Função que define novo valor para OrdemFinalizar.
 */

/**
 * 
 * @param {Object} props Props do componente.
 * @param {Array<Object>} props.ordens Estado 'Ordens' proveninte do componente ControleProducao com as ordens que devem aparecer na lista com seus respectivos dados.
 * @param {React.Dispatch<React.SetStateAction<Array<Object>>>} props.setLocalStorage Função que define novo valor para o estado LocalStorage.
 * @returns {JSX.Element} Componente com uma lista mostrando os dados das ordens não finalizadas.
 */
function OrdensLista({ ordens, setLocalStorage }) {

    /**
     * Estado que Define a visualização do modal de pausa.
     */
    const [ModalPausa, setModalPausa] = useState(false)
    /**
     * Estado que guarda os dados da ordem clicada para pausar.
     */
    const [OrdemPausada, setOrdemPausada] = useState({})
    /**
     * Estado que define a visualização do modal de edição.
     */
    const [ModalEdicao, setModalEdicao] = useState(false)
    /**
     * Estado que guarda os dados da ordem clicada para editar.
     */
    const [OrdemEditando, setOrdemEditando] = useState({})
    /**
     * Estado que define a visualização do modal de finalização.
     */
    const [ModalQuantidadeFinalizacao, setModalQuantidadeFinalizacao] = useState(false)
    /**
     * Estado que guarda os dados da ordem clicada para Finalizar.
     */
    const [OrdemFinalizar, setOrdemFinalizar] = useState({})
    
    /**
     * Quando a ordem estiver pausada pega o ultimo motivo de pausa para mostrar escrito.
     * @param {string} motivos String com os motivos das pausas separados por ' , ' . 
     * @returns Retorna o ultimo motivo descrito na string.
     */
    function pegaUltimoMotivoPausa(motivos) {
        if (motivos) {
            const motivosArray = motivos.split(',')
            const ultimoMotivo = motivosArray[motivosArray.length - 1]
            return ultimoMotivo
        }
    }

    /**
     * Define o Estado ModalPausa como true ou false, quando definido para true define também o estado OrdemPausada com os dados da ordem.
     * @param {Object} ordem Dados da ordem que ativou a função.
     */
    function HandleModalPausa(ordem) {
        if (ModalPausa === false) {
            setModalPausa(true)
            setOrdemPausada(ordem)
        }
        if (ModalPausa === true) {
            setModalPausa(false)
        }
    }

    /**
     * Define o Estado ModalEdicao como true ou false, quando definido para true define também o estado OrdemEditando com os dados da ordem.
     * @param {Object} ordem Dados da ordem que ativou a função.
     */
    function HandleModalEdicao(ordem) {
        if (ModalEdicao === false) {
            setModalEdicao(true)
            setOrdemEditando(ordem)
        }
        if (ModalEdicao === true) {
            setModalEdicao(false)
        }
    }

    /**
     * Define o Estado ModalQuantidadeFinalizacao como true ou false, quando definido para true define também o estado OrdemFinalizar com os dados da ordem.
     * @param {Object} ordem Dados da ordem que ativou a função.
     */
    function HandleModalQuantidadeFinalizacao(ordem) {
        if (ModalQuantidadeFinalizacao === false) {
            setModalQuantidadeFinalizacao(true)
            setOrdemFinalizar(ordem)
        }
        if (ModalQuantidadeFinalizacao === true) {
            setModalPausa(false)
        }
    }

    /**
     * Função ativada quando a ordem esta pausada e voltará para em andamento.
     * Funcionamento: 
     * Altera algumas informações da ordem, status para 'Em Andamento', define horario_recomeco para data e hora atual, soma o tempo pausado a qnt_pausado e salva na localstorage.
     * Define o tempo pausado da ordem nos dados de pausasOrdens do localstorage.
     * @param {Object} ordem Dados da ordem que ativou a função.
     * @throws {Error} Quando não encontra a ordem na localstorage.
     */
    function HandleRetornaPausa(ordem) {
        if (ordem.status === 'Pausado') {
            const ordensLocalStorage = JSON.parse(localStorage.getItem('ordensNaoFinalizadas')) || [];
            const ordemAtualIndex = ordensLocalStorage.findIndex(element => element.id === ordem.id);

            if (ordemAtualIndex !== -1) {
                //Atualiza os valores de horario_recomeço, qnt_pausado e status da ordem.
                const ordemAtual = ordensLocalStorage[ordemAtualIndex];
                const dataRecomeco = new Date()
                const dataRecomecoString = tranformarDataEmString(dataRecomeco)
                const horarioPausa = `${ordemAtual['horario_pausa']}`
                const dateMiliseconds = Date.parse(horarioPausa)
                const dataPausa = new Date(dateMiliseconds + 10800000)
                const diferencaHorariosMiliSegundos = dataRecomeco - dataPausa
                ordemAtual['horario_recomeco'] = dataRecomecoString
                ordemAtual['status'] = 'Em Andamento'
                if (ordem['qnt_pausado']) {
                    ordemAtual['qnt_pausado'] = ordemAtual['qnt_pausado'] + diferencaHorariosMiliSegundos
                } else {
                    ordemAtual['qnt_pausado'] = diferencaHorariosMiliSegundos
                }
                ordensLocalStorage[ordemAtualIndex] = ordemAtual;
                localStorage.setItem('ordensNaoFinalizadas', JSON.stringify(ordensLocalStorage));
                setLocalStorage(ordensLocalStorage) 

                //Define o tempo pausado da ultima pausa desta ordem nos dados da localstorage pausasOrdens.
                const pausasLocalStorage = JSON.parse(localStorage.getItem('pausasOrdens')) || [];
                const pausasLocalStorageIndex = pausasLocalStorage.findIndex(element => element.id === ordem.id)
                if (pausasLocalStorageIndex !== -1) {
                    const ultimoIndice = pausasLocalStorage[pausasLocalStorageIndex].pausas.length - 1
                    pausasLocalStorage[pausasLocalStorageIndex].pausas[ultimoIndice]['tempo_pausado'] = diferencaHorariosMiliSegundos
                    localStorage.setItem('pausasOrdens', JSON.stringify(pausasLocalStorage))
                }

            } else {
                throw new Error('Ordem não encontrada na localStorage.');
            }

        }
    }

    return (
        <ContainerOrdens>

            <OrdensUl>
                {
                    ordens.map((ordem, index) => (
                        <OrdensLi backgroundcolor={ordem.status === 'Em Andamento' ? '#24ab92' : '#bf6b47'} key={index}>

                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>ORDEM PRODUÇÃO:</Titulo4>
                                <SpanOrdem>{ordem.ordem_producao}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>FUNCIONARIOS:</Titulo4>

                                <DivLinha>
                                    {
                                        ordem.matriculas.map((matricula, index) => (
                                            <SpanOrdem key={index}>{matricula}</SpanOrdem>
                                        ))
                                    }
                                </DivLinha>

                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>MESA:</Titulo4>
                                <SpanOrdem>{ordem.mesa}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>STATUS:</Titulo4>
                                <SpanOrdem>{ordem.status}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>TURNO:</Titulo4>
                                <SpanOrdem>{ordem.turno}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4 backgroundcolor='white' border_radius='5px 5px 0px 0px' font_size='16px'>MOTIVO DA PAUSA:</Titulo4>
                                <SpanOrdem>{ordem.status === "Pausado" ? pegaUltimoMotivoPausa(ordem.motivos_das_pausas) : ''}</SpanOrdem>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.3px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' font_size='20px' backgroundcolor={ordem.status === 'Em Andamento' ? '#DAA520' : '#00FA9A'} onClick={async () => { ordem.status === 'Em Andamento' ? HandleModalPausa(ordem) : HandleRetornaPausa(ordem) }} width='80%'>{ordem.status === 'Em Andamento' ? 'PAUSAR' : 'RETORNAR'}</Botao>
                            </ItemLista>
                            <ItemLista>
                                <Botao border='0.3px black solid' boxshadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2);' padding='10px 5px' border_radius='5px' backgroundcolor='#FF6347' color='black' font_size='20px' width='80%' onClick={async () => await HandleModalQuantidadeFinalizacao(ordem)}>FINALIZAR</Botao>
                            </ItemLista>
                            <Botao padding='2px 2px' backgroundcolor='rgb(0,0,0,0)' color='black' font_size='20px' width='10%' onClick={() => HandleModalEdicao(ordem)}><Imagem src={ImagemEditar} width='60%'></Imagem></Botao>

                        </OrdensLi>

                    )
                    )
                }
            </OrdensUl>
            <ModalPausaComponent
                setLocalStorage={setLocalStorage}
                ModalPausa={ModalPausa}
                setModalPausa={setModalPausa}
                OrdemPausada={OrdemPausada}
            />

            <ModalFinalizar
                ModalQuantidadeFinalizacao={ModalQuantidadeFinalizacao}
                setModalQuantidadeFinalizacao={setModalQuantidadeFinalizacao}
                setLocalStorage={setLocalStorage}
                ordens={ordens}
                OrdemFinalizar={OrdemFinalizar}
            />

            <ModalEditar
                setModalEdicao={setModalEdicao}
                setLocalStorage={setLocalStorage}
                ModalEdicao={ModalEdicao}
                ordens={ordens}
                OrdemEditando={OrdemEditando}

            />

        </ContainerOrdens>
    )
}

export default OrdensLista