import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[server]: Lá Chắn Số Backend running at http://localhost:${PORT}`);
});
