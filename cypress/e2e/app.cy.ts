/**
 * This panel of tests is designed to follow the payment journey of a newly created transaction.
 * It also tests the various corrective redirects that should occur when the user attempts to navigate to
 * pages that are not part of the payment journey.
 */
describe('Given that the application is running', () => {
  // META: We will be injecting a uuid to be used for this testing lifecycle
  // but ideally we could have a fixture that uses the API to create a new payment
  const uuid = Cypress.env('uuid');

  it('should render the root page with the correct text', () => {
    cy.visit('http://localhost:3000/');

    // Then the page should contain an h1 with the text "BVNK Test"
    cy.get('h1').should('contain.text', 'BVNK Test');

    // And the page should contain a code block with the text "/payin/{uuid}"
    cy.get('code').should('contain.text', '/payin/{uuid}');
  });

  it('should detect an invalid uuid and redirect to the invalid uuid page', () => {
    cy.visit('http://localhost:3000/payin/invalid-uuid');
    cy.url().should('include', '/payin/invalid-uuid/invalid');
  });

  it('should redirect to the expired page when given an expired uuid', () => {
    // META: We are using a hardcoded value but ideally we could have a fixture
    // That creates a new payment with a quote that expires immediately
    const expiredUuid = '34a138dd-a794-4022-8606-b85b0a939772';
    cy.visit(`http://localhost:3000/payin/${expiredUuid}`);
    cy.url().should('include', `/payin/${expiredUuid}/expired`);
  });

  it('should redirect from the expired to the accept quote page if the user attempts to connect directly to the expired page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}/expired`);
    cy.url().should('include', `/payin/${uuid}`);
  });

  it('should redirect from the payment page to the accept quote page if the user attempts to connect directly to the payment page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}/pay`);
    cy.url().should('include', `/payin/${uuid}`);
  });

  it('should render the accept quote page with a selection box for currencies', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}`);

    // Then the page should contain the name of a vendor and the selectbox for currencies
    cy.get('h2').should('exist').and('not.be.empty');
    cy.get('select').should('exist');
  });

  it('should allow the user to select a currency and display the current quote', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}`);

    cy.get('select').select('BTC');
    cy.wait(3000);

    // Then the page should contain a button to confirm the quote
    cy.get('[data-testid="confirm-quote-button"]').should('exist');

    // And the page should contain the amount due and the time until expiry
    cy.get('[data-testid="amount-due"]').should('exist').and('not.be.empty');
    cy.get('[data-testid="time-until-expiry"]')
      .should('exist')
      .and('not.be.empty');
  });

  it('should allow the user to confirm the quote and redirect to the payment page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}`);

    // Then the page should already load with the amount due displayed
    cy.get('[data-testid="amount-due"]').should('exist').and('not.be.empty');

    // We wait 35 seconds to make sure the quote refreshes
    cy.wait(35000);

    // And the page should contain a button to confirm the quote
    cy.get('[data-testid="confirm-quote-button"]').should('exist');

    // When the user clicks the confirm button
    cy.get('[data-testid="confirm-quote-button"]').click();

    // Then the page redirects to /payin/{uuid}/pay
    cy.url().should('include', `/payin/${uuid}/pay`);
  });

  it('should redirect to the payment page if the user connects to the accept quote page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}`);
    cy.url().should('include', `/payin/${uuid}/pay`);
  });

  it('should redirect to the payment page if the user connects to the expired page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}/expired`);
    cy.url().should('include', `/payin/${uuid}/pay`);
  });

  it('should render the quote, QR code and payment details on the payment page', () => {
    cy.visit(`http://localhost:3000/payin/${uuid}/pay`);

    // Then the page should contain the quote, QR code and payment details
    const copyButtonAmountDue = cy.get(
      '[data-testid="copy-button-amount-due"]',
    );
    copyButtonAmountDue.should('exist');

    // When the user clicks the copy button
    copyButtonAmountDue.click();

    // Then the copy button should contain the text "Copied!"
    copyButtonAmountDue.should('contain.text', 'Copied!');

    // And the page should contain the address
    const copyButtonAddress = cy.get('[data-testid="copy-button-address"]');
    copyButtonAddress.should('exist');

    // When the user clicks the copy button
    copyButtonAddress.click();

    // Then the copy button should contain the text "Copied!"
    copyButtonAddress.should('contain.text', 'Copied!');

    // META: We are forcing a 2 minute wait because the transaction is created with an expiry time of 2 mins
    // This is to ensure that the transaction is expired and the user is redirected to the expired page
    cy.wait(180000);

    // Then the page should redirect to the expired page
    cy.url().should('include', `/payin/${uuid}/expired`);
  });
});
