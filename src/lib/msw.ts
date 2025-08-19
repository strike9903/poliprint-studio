// MSW setup for development and testing
export async function enableMocking() {
  if (typeof window === 'undefined') {
    // Node.js environment (SSR)
    const { server } = await import('../mocks/server');
    server.listen({
      onUnhandledRequest: 'bypass'
    });
  } else {
    // Browser environment
    const { worker } = await import('../mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass'
    });
  }
}