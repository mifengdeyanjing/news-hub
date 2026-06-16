import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { ModulePage } from '@/pages/ModulePage';
import { StocksPage } from '@/pages/StocksPage';
import { DetailPage } from '@/pages/DetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/m/:id" element={<ModulePage />} />
      <Route path="/stocks" element={<StocksPage />} />
      <Route path="/article" element={<DetailPage />} />
    </Routes>
  );
}
