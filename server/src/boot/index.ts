import initNest from './nest';
import initSwagger from './swagger';

async function bootApp() {
    const app = await initNest();

    initSwagger(app);

    return app;
}

export default bootApp;