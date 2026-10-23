describe("Preuve de vulnérabilité XSS : L'injection passe avec succès (Code 200 anormal)", () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
  });

  it('Injecte un script XSS dans le formulaire avis et vérifie son comportement au rechargement si code 200 ou 201 alors anormal', () => {
    const xssPayload = '<script>window.xssVulnerable=true</script>';

    cy.intercept('POST', '**/reviews').as('postReview');

    // 1. Soumission de l'avis avec la charge XSS
    cy.visit('/#/reviews');
    cy.get('[data-cy="review-input-rating-images"] img').last().click();
    cy.get('[data-cy="review-input-title"]').type('Test de sécurité XSS');
    cy.get('[data-cy="review-input-comment"]').type(xssPayload, { parseSpecialCharSequences: false });
    cy.get('[data-cy="review-submit"]').click();

    // 2. Vérification de l'enregistrement en BDD
    cy.wait('@postReview').its('response.statusCode').should('be.oneOf', [200, 201]);

    // 3. Rechargement de la page d'avis pour simuler l'affichage ultérieur depuis la BDD
    cy.visit('/#/reviews');

    // 4. PREUVE XSS : Vérification que le script n'a JAMAIS été exécuté dans le navigateur
    cy.window().should((win: any) => {
      expect(win.xssVulnerable).to.be.undefined;
    });

    // 5. Vérification que le titre du commentaire soumis est bien présent dans le DOM
    cy.contains('Test de sécurité XSS').should('be.visible');
  });
});