import styled from "styled-components";
/**
 * Componente de Botão customizavel.
 *
 * @component
 * @property {string} props.color Cor do texto. Valor padrão : 'black'
 * @property {string} props.backgroundcolor Cor de fundo do botão. Valor padrão : 'white'
 * @property {string} props.border_radius Raio da curvatura dos cantos do componente. Valor padrão : '0px'
 * @property {string} props.width Comprimento do componente. Valor padrão : '100%'
 * @property {string} props.border Borda do componente. Valor padrão : '0px'
 * @property {string} props.padding Espaçamento interno do componente. Valor padrão : '0px 0px'
 * @property {string} props.margin Espaçamento externo do componente. Valor padrão : '0px 0px'
 * @property {string} props.font_size Tamanho da fonte. Valor padrão : '14px'
 * @property {string} props.boxshadow Sombra do componente. Valor padrão : '0px 0px 0px'
 * 
 * @desc
 * Componente de Botão.
 * Este componente de botão possui vários estilos personalizáveis através das props. 
 * O botão também possui um comportamento de animação ao passar o mouse e ao clicar:
 * - Ao passar o mouse: Aumenta ligeiramente de tamanho (`scale(1.05)`).
 * - Ao clicar: Move-se ligeiramente para baixo (`translateY(2px)`).
 * 
 * @example
 * const handleClick = () => {
 *   alert('Botão Clicado !!');
 * };
 * return (
 *   <Botao 
 *     color="white" 
 *     backgroundcolor="blue" 
 *     border_radius="5px" 
 *     width="200px" 
 *     border="1px solid black" 
 *     padding="10px 20px" 
 *     margin="10px" 
 *     font_size="16px" 
 *     boxshadow="2px 2px 5px rgba(0,0,0,0.3)"
 *     onClick={handleClick}
 *   >
 *     Clique Aqui
 *   </Botao>
 * );
 */
const Botao = styled.button`
    color: ${props=> props.color || 'black'};
    background-color: ${props=> props.backgroundcolor || 'white'};
    border-radius: ${props=> props.border_radius || '0px'};
    width: ${props=> props.width ||'100%'};
    border: ${props=> props.border || '0px'};
    padding: ${props=> props.padding || '0px 0px'};
    margin: ${props => props.margin || '0px 0px'};
    font-size: ${props => props.font_size|| '14px'};
    box-shadow : ${props => props.boxshadow || '0px 0px 0px'};
    cursor:pointer;
    transition: transform 0.2s;
    &:active {
        transform: translateY(2px);
      }
    &:hover {
        transform: scale(1.05);
    }
`

  

export default Botao

