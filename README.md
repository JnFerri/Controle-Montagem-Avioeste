
# Controle Produção Montagem

O aplicativo de controle de montagem é utilizado no setor produtivo da avioeste para captar informações importantes das ordens de produção que estão na montagem.

### Quais informações e onde são utilizadas ?

Quando uma ordem é finalizada na aplicação ela irá enviar e salvar no jestor algumas informações que serão uteis como :

1. Tempo em produção
2. Tempo pausado
3. Motivos das pausas
4. Motivos de retrabalho quando este for motivo da pausa
5. Matricula dos Funcionarios Responsaveis
6. Mesa de produção
7. Turno
8. Horario de inicio
9. Horario de término
10. Quantidade produzida

### Onde as informações são utilizadas ?

São utilizadas no BI que esta no caminho : 'Y:\Documentos\BI\BI Controle produção' e também nos dashboards do jestor criados para os supervisores da produção.






## Stack utilizada

**Front-end:** React , Styled-Components , react-router-dom

**Back-end:** Node, Express


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT` representa a porta que o servidor rodara no desenvolvimento.

`REACT_APP_token` token da api do jestor.

`REACT_APP_TABELA` tabela jestor onde é salvo os dados.

`REACT_APP_TABELA_PAUSAS` tabela jestor onde é salvo os dados das pausas.

`REACT_APP_API_URL` url para o servidor, em produção 'http://srv-services:3000'. 



## Instalação

 Primeiramente é necessario que esteja instalado em seu computador o nodejs, https://nodejs.org/.

 - Instale as dependencias do projeto. Acesse a pasta do arquivo através do console e utilize o comando ' npm install ' para instalar.

 - Crie um arquivo chamado .env na raiz do projeto e nele configure as variaveis de ambiente descritas acima.

## Rodando localmente para desenvolvimento

- Inicie o servidor localmente na porta 3000.

- Altere a variavel de ambiente `REACT_APP_API_URL` para 'http://localhost:3000'.

Instale as dependencias caso ainda não tenham sido instaladas :

```
npm install
```

Inicie a aplicação localmente :

```
npm start
```


## Criando build e fazendo deploy

Para criar o o arquivo build que é o projeto otimizado para rodar : 

```
npm run build
```

Para iniciar o projeto e colocar ele em produção, após criar o build utilize o comando,  sendo o ' -l 3001 ' a porta que rodará :

```
serve -s build -l 3001
```
## Funcionamento

A aplicação funciona da seguinte forma: 
- O usuario ao entrar na aplicação ira para a pagina de login http://srv-services:3001/, ao colocar usuario e senha, enviara estas informações até o servidor pelo body da requisição e caso condiz com o que esta no servidor ira retornar 'true', definir o estado react de login para true e salvar as informações de login no localstorage para logins futuros. 

- Ao entrar na aplicação há dois botões, um para visualizar o formulario e outro para visualizar a lista de ordens.

- Formulario ao ser preenchido e enviado adiciona as informações na localstorage chamada 'ordensNaoFinalizadas' no estado react 'LocalStorage' e também ao salvar neste estado, salva as mesmas informações no estado 'Ordens'.

- Sempre que atualizar o localstorage de 'ordensNaoFinalizadas' é necessario adicionar todos os dados da localstorage ao estado 'LocalStorage' e automaticamente atualizara o valor do estado 'Ordens' com todos os dados das ordens não finalizadas. 

- Ao pausar uma ordem pede um motivo. Para cada ordem que possui pausas, os dados destas pausas ficam salvos na localstorage de 'pausasOrdens'.

- Ao finalizar alguma ordem todos os dados desta ordem da localstorage 'ordensNaoFinalizadas' e das pausas 'pausasOrdens' juntamente com os horarios de finalização e dados de finalização são enviados ao servidor para que este salve os dados nas tabelas do jestor.