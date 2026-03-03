import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import path from "path";

connectDB();

const __dirname = path.resolve();

// Serve frontend
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} on port ${PORT}`);
});

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});