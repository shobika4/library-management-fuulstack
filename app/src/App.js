
import './App.css';
import Home from './Home';
import User from './Users';
import Admin from './Admin';
import Page1 from './Page1';
import Page from './Page';


import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
   <BrowserRouter>
    
      <Routes>
        <Route path="/user" element={<User/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/Page1" element={<Page1/>}/>
        <Route path="/Page" element={<Page/>}/>
        
       
      </Routes>
    
   </BrowserRouter>
  );
}

export default App;
