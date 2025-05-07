// Custom commands for Cypress

// Add a custom command to handle waiting for loading to finish
Cypress.Commands.add('waitForLoading', () => {
  cy.contains('Loading stocks', { timeout: 10000 }).should('not.exist');
})