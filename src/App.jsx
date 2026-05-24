import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CertificateViewer from './pages/CertificateViewer';
import AdminUpload from './pages/AdminUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/noc/E_Certificate/:id" element={<CertificateViewer />} />
        <Route path="/certificates/:id" element={<CertificateViewer />} />
        <Route path="/admin" element={<AdminUpload />} />
        <Route path="/" element={<AdminUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
