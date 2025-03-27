import bootNest from './nest';
import initRbac from './rbac';
import initSwagger from './swagger';

async function bootApp() {
    await initRbac();
    
    const app = await bootNest();

    initSwagger(app);

    return app;
}

export default bootApp;