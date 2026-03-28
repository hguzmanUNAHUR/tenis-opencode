import express from 'express';
import playersRoutes from './players/players.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AceManager API running' });
});

app.use('/api', playersRoutes);

app.listen(PORT, () => {
  console.log(`🚀 AceManager running on http://localhost:${PORT}`);
});
