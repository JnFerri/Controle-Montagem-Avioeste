import { useState } from "react";
import styled from "styled-components";
import { OrdensController } from "../../Controller/OrdensController.js";
import Botao from "../Botao/Botao.js";
import Titulo4 from "../Titulo4/Titulo4.js";

const ordensController = new OrdensController()

const ContainerOrdens = styled.section`
    width:90%;
    background-color:white;
    border-radius:30px;
    display: flex;
    flex-direction:column;
    align-items:center;
`
const OrdensUl = styled.ul`
    display:flex;
    align-items:center;
    justify-content:center;
    width: 95%;
    flex-direction:column;
    padding-inline-start: 0px;
    text-align:center;

`
const OrdensLi = styled.li`
    width: 100%;
    display:flex;
    align-items:center;
    padding:10px 0px;
    border:solid 0.5px black;
    border-radius:15px;
    margin:4px 0px;


`
const ItemLista = styled.div`
width:25%;
padding: 5px 5px;
display:flex;
flex-direction:column;
align-items:center; 
`


function OrdensLista(){
    const [Ordens, setOrdens] = useState([])
    
   async  function PegarOrdens(){
        const ordens = await ordensController.pegaDadosLista('fk0lbipncnh3mu7u95dls')
        const ordensNaoFinalizadas = ordens.filter(ordem => ordem.finalizado === false)
        console.log(ordensNaoFinalizadas)
        setOrdens(ordensNaoFinalizadas)
   }
    
    return(
        <ContainerOrdens>
            <Botao onClick={PegarOrdens} width='30%' border='solid 0.5px black' padding='10px 5px' borderRadius='5px' margin='5px 0px'>Clique para Mostrar as ordens</Botao>
            <OrdensUl>
                {
                    Ordens.map(ordem =>  (
                        <OrdensLi key={ordem.id_fk0lbipncnh3mu7u95dls}>
                            
                            <ItemLista>
                                <Titulo4>Ordem Produção:</Titulo4>
                                <span>{ordem.ordem_producao}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Matricula Operador:</Titulo4>
                                <span>{ordem.matricula}</span>
                            </ItemLista>
                            <ItemLista>
                                <Titulo4>Mesa de Montagem:</Titulo4>
                                <span>{ordem.mesa_teste}</span>
                            </ItemLista>
                        </OrdensLi>
                    )

                    )
                }
            </OrdensUl>
        </ContainerOrdens>
    )
}

export default OrdensLista