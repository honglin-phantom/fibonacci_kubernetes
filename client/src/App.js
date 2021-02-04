import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'; 
import OtherPage from './OtherPage'; 
import Fib from './Fib'; 

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="/OtherPage">Other Page</Link>
          
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>

          <br/>

          {/* add routes for navigation */}
          <div>
            <Route exact path="/" component={Fib}></Route>
            <Route path="/OtherPage" component={OtherPage}></Route>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
