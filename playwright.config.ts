import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { resolve } from 'path'; // 👈 Corrección 1: Importamos directamente 'resolve'

// Cargar el archivo .env desde la raíz del proyecto
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Detectar qué entorno queremos usar (Si no pasamos ninguno, por defecto usa PROD)
const entorno = process.env.ENV || 'PROD';

// Mapeo dinámico de URLs y credenciales según el entorno elegido
const configEntornos = {
  PROD: {
    url: process.env.URL_PROD,
    user: process.env.USER_PROD,
    password: process.env.PASSWORD_PROD,
  },
  STAGE: {
    url: process.env.URL_STAGE,
    user: process.env.USER_STAGE,
    password: process.env.PASSWORD_STAGE,
  }
};

// Validamos que el entorno exista en nuestro mapeo para evitar sustos
const entornoActual = configEntornos[entorno as keyof typeof configEntornos] || configEntornos.PROD;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, 
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    // 👈 Corrección 2: La URL ahora es 100% dinámica según el entorno
    baseURL: entornoActual.url, 
    trace: 'on-first-retry',           
    screenshot: 'only-on-failure',     
    video: 'retain-on-failure',        
  },
  
  projects: [
    {
      name: 'ui-chromium',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-firefox',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-webkit',
      testMatch: /.*tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    // 👈 Corrección 3: Limpiamos el project de API porque ya no existe la carpeta
  ],
});

// Exportamos el entorno actual para que tus tests/fixtures puedan leer USER y PASSWORD
export { entornoActual };