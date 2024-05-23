import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/**
 * Componente de section simples utilizado como container dos outros componentes.
 */
const LoginContainer = styled.section`
display:flex;
flex-direction: column;
align-items:center;
background-color:white;
margin:20vh 0px;
width:50%;
border-radius:20px;
`

/**
 * Estado que guarda o valor do input de Usuario do componente Login.
 * @typedef {EstadoReact} Usuario
 * @property {string} Usuario - Valor do input de Usuario.
 */

/**
 * Estado que guarda o valor do input de Senha do componente Login.
 * @typedef {EstadoReact} Senha
 * @property {string} Senha - Valor do input de Senha.
 */

/**
 * Elemento da Pagina de Login, Utilizado para Pegar informações de usuario e senha através dos inputs e salvar no banco de dados 'Login' do localstorage, ao salvar atualiza o estado de LoginLocalStorage e consequentemente envia o usuario a rota da pagina principal /controleProducao.
 * @function Login
 * @param {Object} todosOsDadosLogin Objeto com os estados LoginConferencia, setLoginConferencia, LoginLocalStorage e setLoginLocalStorage 
 * @returns {JSX.Element}
 */
function Login({todosOsDadosLogin}){
    /**
     * Estado que salva o valor do input de usuario.
     */
    const [Usuario, setUsuario] = useState('')
    /**
     * Estado que salva o valor do input de senha.
     */
    const [Senha, setSenha] = useState('')
    /**
     * React hook para ir até outra rota.
     */
    const navigate = useNavigate();
    
    /**
     * Ao carregar a pagina confere se o Estado LoginConferencia for true acessa a rota principal /controleProducao.
     */
    useEffect(() => {
        const handleRetornaLogin = () => {
          navigate("/controleProducao");
        }
        if(todosOsDadosLogin.LoginConferencia === true){
          handleRetornaLogin()
        }
      },[todosOsDadosLogin.LoginLocalStorage, todosOsDadosLogin.LoginConferencia,navigate])

      /**
       * Salva os dados de usuario e senha no banco de dados Login da localstorage e posteriormente salva as informações de Login no estado LoginLocalStorage para que este ao ser atualizado faça a conferencia de login em App.js e retone LoginConferencia como true.
       * @param {*} event Evento de Click do mouse, utilizado para previnir carregamento da pagina.
       */
    function defineLogin(event){
        event.preventDefault()
        localStorage.setItem('Login', JSON.stringify({Usuario: Usuario, Senha: Senha}))
        todosOsDadosLogin.setLoginLocalStorage(JSON.parse(localStorage.getItem('Login')) || [])
    }
    /**
     * Pega valor do input usuario e salva no estado Usuario.
     * @param {*} event Evento utilizado para pegar o valor do target.
     */
    function handleUsuario(event){
        setUsuario(event.target.value)
        
    }
    
    /**
     * Pega o valor do input senha e salva no estado Senha.
     * @param {*} event Evento utilizado para pegar o valor do target.
     */
    function handleSenha(event){
        setSenha(event.target.value)
    }
    return(
        <LoginContainer>
            <Titulo2>Usuario:</Titulo2>
            <Input type="text" value={Usuario} onChange={handleUsuario} placeholder="Coloque o nome de usuario..." padding='15px 0px' margin='10px 0px' border='0.5px solid black' font_size='20px' border_radius='20px' width='80%'></Input>
            <Titulo2>Senha:</Titulo2>
            <Input type="password" value={Senha} onChange={handleSenha} placeholder="Coloque a senha de usuario..." padding='15px 0px' margin='10px 0px' border='0.5px solid black' font_size='20px' border_radius='20px' width='80%'></Input>
            <Botao onClick={defineLogin} width = '50%' padding='15px 0px' margin='20px 0px' backgroundcolor='#79b3e0' font_size='26px' border='0.5px solid black' border_radius='10px' boxshadow='2px 2px 5px black'>ENTRAR</Botao>
        </LoginContainer>
    )
}

export default Login