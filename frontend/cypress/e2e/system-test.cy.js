describe('Stock Tracker System Test', () => {
  beforeEach(() => {
    // Visit the application running in Docker
    cy.visit('http://localhost:8080');
  });

  it('should show the application title', () => {
    cy.contains('Stock Tracker').should('be.visible');
  });

  it('should search for a stock by symbol and display results', () => {
    // Find the search input and type a stock symbol
    cy.get('[placeholder*="AAPL"]').type('AAPL');
    
    // Click the search button
    cy.get('button').contains('Search').click();
    
    // Wait for results to load
    cy.contains('Loading stocks', { timeout: 10000 }).should('not.exist');
    
    // Verify a result is shown with the correct symbol
    cy.contains('AAPL').should('be.visible');
    cy.contains('Apple Inc').should('be.visible');
    
    // Verify price data is displayed
    cy.get('td:contains("AAPL")').parent('tr').within(() => {
      cy.get('td').should('have.length.at.least', 4);
    });
  });

  it('should search for a stock by company name', () => {
    // Switch to company name search
    cy.contains('Company Name').click();
    
    // Find the search input and type a company name
    cy.get('[placeholder*="Apple"]').type('Apple');
    
    // Click the search button
    cy.get('button').contains('Search').click();
    
    // Wait for results to load
    cy.contains('Loading stocks', { timeout: 10000 }).should('not.exist');
    
    // Verify results are shown
    cy.contains('AAPL').should('be.visible');
  });

  it('should display more details when clicking on a stock', () => {
    // Search for a stock
    cy.get('[placeholder*="AAPL"]').type('AAPL');
    cy.get('button').contains('Search').click();
    
    // Wait for results
    cy.contains('Loading stocks', { timeout: 10000 }).should('not.exist');
    
    // Click on the stock row
    cy.contains('tr', 'AAPL').click();
    
    // Verify modal with chart appears
    cy.contains('Price Range').should('be.visible');
    cy.get('[data-testid="chart-modal"]').should('be.visible');
    
    // Close the modal
    cy.get('[data-testid="close-modal"]').click();
    cy.get('[data-testid="chart-modal"]').should('not.exist');
  });

  it('should handle error states gracefully', () => {
    // Search for an invalid stock symbol to trigger an error
    cy.get('[placeholder*="AAPL"]').type('INVALID_SYMBOL_12345');
    cy.get('button').contains('Search').click();
    
    // Wait for results
    cy.contains('Loading stocks', { timeout: 10000 }).should('not.exist');
    
    // Should show empty results or error message
    cy.contains('No results to display').should('be.visible');
  });
});