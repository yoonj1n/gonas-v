import './App.css';
// import Mainpage from './components/Mainpage';
import Router from './components/Router';
let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
})


function App() {
  return (
    <div className="App">
      <Router/>
    </div>
  );
}

export default App;
