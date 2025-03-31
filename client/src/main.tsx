import { createRoot } from 'react-dom/client';

import { boot } from './boot/index.tsx';
import { VERSION } from './version.ts';

const app = boot();

console.log(`App mode: ${import.meta.env.MODE}, API url: ${import.meta.env.VITE_API_URL}, Version: ${VERSION}`);

createRoot(document.getElementById('root')!).render(app);
