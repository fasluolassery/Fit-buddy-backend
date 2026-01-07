import app from "./app";
import logger from "./utils/logger.util";
import { env } from "./config/env.config";
import { connectDB } from "./config/mongoose.config";

const PORT = env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  //move these to env
  logger.info(`Server running at http://localhost:${PORT}`);
});
