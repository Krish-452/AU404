import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const startServer = async () => {
    await connectDB();
    await import('./utils/autoSeed').then(m => m.autoSeed());

    app.listen(config.port, () => {
        console.log(`Server running in ${config.env} mode on port ${config.port}`);
    });
};

startServer();
