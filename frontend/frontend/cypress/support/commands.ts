/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginViaApi(username?: string, password?: string): Chainable<void>;
  }
}

Cypress.Commands.add('loginViaApi', (username = 'test2@test.fr', password = 'testtest') => {
  cy.session(
    [username, password],
    () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/login',
        body: { username, password }
      }).then((response) => {
        expect(response.status).to.eq(200);
        window.localStorage.setItem('token', response.body.token);
      });
    },
    {
      validate() {
        // Vérification de la présence du token
        expect(window.localStorage.getItem('token')).to.exist;
      }
    }
  );
});