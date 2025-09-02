import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
function App() {
  const {user , loginWithRedirect, isAuthenticated, logout, isLoading} = useAuth0();
  console.log(user);
if(isLoading) return <div>Loading...</div>
  return (
    <div className="App">
      <header className="App-header">
        <h3>Hello, {user?.name || "Guest"}</h3>{
      isAuthenticated ? <button onClick={e=>logout()}>Logout</button> :  <button onClick={e=> loginWithRedirect()}>Login or Signup</button>
        }
      </header>
    </div>
  );
}

export default App;
