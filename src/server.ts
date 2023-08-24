import { createApp } from './app/app';
import { config } from './config';

const port = config.PORT;

const { app } = createApp(config);

app.listen(port, () => {
  console.info(`App listens on port: ${port}`);
});
