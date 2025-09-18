import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Projects from './components/Projects';
import Notes from './components/Notes';
import { Routes, Route } from "react-router-dom";
function App() {
  const {user , loginWithRedirect, isAuthenticated, logout, isLoading} = useAuth0();
  console.log(user);
if(isLoading) return <div>Loading...</div>
  return (
    <div className="App">
      {/* <header className="App-header">
        <h3>Hello, {user?.name || "Guest"}</h3>{
      isAuthenticated ? <button onClick={e=>logout()}>Logout</button> :  <button onClick={e=> loginWithRedirect()}>Login or Signup</button>
        }
      </header> */}
{/* <Home/> */}
{/* <Projects/> */}
    {/* <Notes/> */}


     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Projects" element={<Projects />} />
    </Routes>
    </div>
  );
}

export default App;
