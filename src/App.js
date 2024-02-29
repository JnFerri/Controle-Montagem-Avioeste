import './App.css';
import Header from './Components/Header/Header.js';
import FormInputOP from './Components/FormInputOrdem/FormInputOrdem.js';
require('dotenv').config()

function App() {
  return (
    <div className="App">
     <Header></Header>
     <FormInputOP></FormInputOP>
    </div>
  );
}

export default App;
