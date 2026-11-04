// frontend/src/user/routes.tsx
import { Route } from 'react-router-dom';
import JoinPage from './pages/JoinPage';
import PlayPage from './pages/PlayPage'; // crear este

export const userRoutes = [
  <Route key="user-join" path="/" element={<JoinPage />} />,
  <Route key="user-play" path="/play/:sessionId" element={<PlayPage />} />,
];