import { test, expect } from '@playwright/test';

test.describe('Pruebas de API - Gestión de Posts', () => {

  test('GET - Debería obtener el post número 1 correctamente', async ({ request }) => {
    // Playwright le pega esto automáticamente a https://jsonplaceholder.typicode.com
    const response = await request.get('/posts/1');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
  });

  test('POST - Debería crear un post nuevo con éxito', async ({ request }) => {
    const response = await request.post('/posts', {
      data: {
        title: 'Mi primer test de API',
        body: 'Esto es un post automatizado con Playwright',
        userId: 1
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe('Mi primer test de API');
  });

});