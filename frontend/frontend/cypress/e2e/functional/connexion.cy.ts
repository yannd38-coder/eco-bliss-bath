describe('Tests fonctionnels - Page de connexion', () => {
  beforeEach(() => {
    cy.visit('/#/login');
  });

  it('1. Connexion réussie avec des identifiants valides', () => {
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    // Redirection et présence du bouton de déconnexion
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
  });

  it('2. Échec de connexion avec un mot de passe incorrect', () => {
    // Interception de l'appel login pour tolérer le statut d'erreur HTTP 401
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('mauvaismdp');
    cy.get('[data-cy="login-submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get('[data-cy="nav-link-logout"]').should('not.exist');
    cy.get('[data-cy="login-errors"], .error').should('be.visible');
  });

  it('3. Échec de connexion avec un compte inexistant', () => {
    // Vérification que l'API rejette correctement la connexion (Code HTTP 401)
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('[data-cy="login-input-username"]').type('inconnu@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get('[data-cy="nav-link-logout"]').should('not.exist');
    cy.get('[data-cy="login-errors"], .error').should('be.visible');
  });
});