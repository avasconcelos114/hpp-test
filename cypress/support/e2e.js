import '@cypress/code-coverage/support';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('hydration-mismatch')) {
    return false;
  }
});