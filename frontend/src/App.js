//import logo from './logo.svg';
import './App.css';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import index from './components/index';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TSE react app frontend</h1>
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>
          Edit <code>src/App.js</code> and save to reload.  {/* just some test text*/} 
        </p>

        <a                            // renders a clickable link
          className="App-link"        // style from App.css
          href="https://reactjs.org"  // link
          target="_blank"             // open in new tab
          rel="noopener noreferrer"   // security best practice for external links
        >                             
          clickable link
        </a>
      </header>
      <main>
        <routes>
          <route path={"/index"} element={<index />} />
        </routes>
      </main>
    </div>
  );
}

export default App;
