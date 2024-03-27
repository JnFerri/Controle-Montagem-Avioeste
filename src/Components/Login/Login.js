import styled from "styled-components";
import Titulo2 from "../Titulo2/Titulo2.js";
import Input from "../Input/Input.js";
import Botao from "../Botao/Botao.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


const LoginContainer = styled.section`
display:flex;
flex-direction: column;
align-items:center;
background-color:white;
margin:20vh 0px;
width:50%;
border-radius:20px;
`


function Login({todosOsDadosLogin}){
    /*const loginteste = {
        Usuario : 'admin',
        Senha: '123'
    }*/
    //localStorage.setItem('Login', JSON.stringify(loginteste))
    const [Usuario, setUsuario] = useState('')
    const [Senha, setSenha] = useState('')
    const navigate = useNavigate();
    
    useEffect(() => {
        const handleRetornaLogin = () => {
          navigate("/controleProducao");
        }
        if(todosOsDadosLogin.LoginConferencia === true){
            console.log(todosOsDadosLogin.LoginConferencia)
          handleRetornaLogin()
        }
      },[todosOsDadosLogin.LoginLocalStorage, todosOsDadosLogin.LoginConferencia,navigate])

    function defineLogin(event){
        event.preventDefault()
        localStorage.setItem('Login', JSON.stringify({Usuario: Usuario, Senha: Senha}))
        todosOsDadosLogin.setLoginLocalStorage(JSON.parse(localStorage.getItem('Login')) || [])
    }
    
    function handleUsuario(event){
        setUsuario(event.target.value)
        
    }
    
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