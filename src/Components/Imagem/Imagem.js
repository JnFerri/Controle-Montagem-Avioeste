import styled from "styled-components"

/**
 * Componente simples de Imagem
 * @property {string} width Define o comprimento do componente.
 * @property {string} margin Define a margem do componente.
 * @example
 * //importa alguma imagem dos arquivos.
 * import ImagemExemplo from "../../imagens/imagemTeste.jpg";
 * 
 * return (
 * <Imagem 
 * src={ImagemExemplo}
 * width='50%'
 * margin='10px 10px'
 * />
 * )
 */
const Imagem = styled.img`
width: ${props=> props.width || "100%"};
margin: ${props => props.margin || "0px 0px"};
`

export default Imagem