import {createRoot} from 'react-dom/client';
import {App} from './app/App';
import '@shared/config/i18n/i18n';

createRoot(document.getElementById('root')!).render(
	<App />
);