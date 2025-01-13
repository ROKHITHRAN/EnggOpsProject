import logo from './logo.svg';
import './App.css';
import MainPage from './components/MainPage';
import EnhancedTable from './components/Table.tsx';
import { GlobeIdProvider } from './context/GlobeIdContext.jsx';

function App() {
  return (
    <div className="App">
      <GlobeIdProvider>
        <MainPage />
      </GlobeIdProvider>
      {/* <EnhancedTable/> */}
    </div>
  );
}

export default App;
