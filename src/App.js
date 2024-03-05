import './App.css';
import Header from './Components/Header/Header.js';
import FormInputOP from './Components/FormInputOrdem/FormInputOrdem.js';
import OrdensLista from './Components/OrdensLista/OrdensLista.js';


function App() {
  return (
    <div className="App">
     <Header></Header>
     <FormInputOP></FormInputOP>
     <OrdensLista></OrdensLista>
    </div>
  );
}

export default App;
