import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';
import { userRoutes } from './user/routes';
import { adminRoutes } from './admin/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {userRoutes}
        {adminRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;