import app from "./app";
import logger from "./utils/logger.util";
import { env } from "./config/env.config";

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
