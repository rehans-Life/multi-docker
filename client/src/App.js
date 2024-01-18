import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import Otherpage from './Otherpage';
import Fib from './Fib';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo'/>
          <h1 className='App-title'>fibonacci calculator version develop</h1>
          <Link to='/'>Home</Link>
          <Link to='/other'>Other Page</Link>
        </header>
        <Routes>
          <Route exact path='/other' element={<Otherpage/>}/>
          <Route exact path='/' element={<Fib />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
