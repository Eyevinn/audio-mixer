import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { SideNav } from './components/sideNav/SideNav';
import { MixesPage } from './pages/mixes/Mixes';
import { StripsPage } from './pages/strips/Strips';
import { OutputMixesPage } from './pages/outputs/ouputMixes/OutputMixes';
import { OutputMappingPage } from './pages/outputs/outputMapping/OutputMapping';
import { ConfigureMixPage } from './pages/mixes/configureMix/ConfigureMix';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 min-h-screen flex">
        <div className="flex-shrink-0 overflow-hidden">
          <SideNav />
        </div>
        <Routes>
          <>
            <Route path="/strips" element={<StripsPage />} />
            <Route path="/mixes" element={<MixesPage />} />
            <Route path="/outputs/output-mixes" element={<OutputMixesPage />} />
            <Route
              path="/outputs/output-mapping"
              element={<OutputMappingPage />}
            />
            <Route
              path="/configure-mix/:mixId"
              element={<ConfigureMixPage />}
            />
          </>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
