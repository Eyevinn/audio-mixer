import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { SideNav } from './components/sideNav/sideNav';
import { MixesPage } from './pages/mixes/mixes';
import { StripsPage } from './pages/strips/strips';
import { OutputMixesPage } from './pages/outputs/ouputMixes/outputMixes';
import { OutputMappingPage } from './pages/outputs/outputMapping/outputMapping';
import { ConfigureMixPage } from './pages/mixes/configureMix/configureMix';

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
