describe("E2E - Tunnel d'achat complet avec persistance BDD", () => {
  const baseUrl = 'http://localhost:8080';

  it('Exécute une commande complète et vérifie la décrémentation en BDD', () => {
    let initialStock = 0;

    // 1. Préparation de l'interception 
    cy.intercept('PUT', '**/orders/add').as('ajoutPanier');

    // 2. Récupération du stock initial (produit 4)
    cy.request('GET', 'http://localhost:8081/products/4').then((res) => {
      initialStock = res.body.availableStock;

      // 3. Connexion 100% IHM
      cy.visit(`${baseUrl}/#/login`);
      cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
      cy.get('[data-cy="login-input-password"]').type('testtest');
      cy.get('[data-cy="login-submit"]').click();
      cy.get('[data-cy="nav-link-cart"]').should('be.visible');

      // 4. Navigation vers le produit
      cy.get('[data-cy="nav-link-products"]').click();
      cy.contains('.mini-product', "Chuchotements d'été").find('button').click();

      // 5. Ajout au panier AVEC saisie de la quantité
      cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
      cy.get('[data-cy="detail-product-add"]').click();

      // attente que le backend valide l'ajout 
      cy.wait('@ajoutPanier').its('response.statusCode').should('eq', 200);

      // 6. Finalisation de la commande
      cy.get('[data-cy="nav-link-cart"]').click();
      cy.get('[data-cy="cart-line-name"]').should('be.visible');

      cy.get('[data-cy="cart-input-lastname"]').type('Dupont');
      cy.get('[data-cy="cart-input-firstname"]').type('Jean');
      cy.get('[data-cy="cart-input-address"]').type('10 Rue de la Paix');
      cy.get('[data-cy="cart-input-zipcode"]').type('75001');
      cy.get('[data-cy="cart-input-city"]').type('Paris');

      cy.get('[data-cy="cart-submit"]').click();
      cy.url().should('include', '/confirmation');

      // 7. Vérification de la BDD
      cy.request('GET', 'http://localhost:8081/products/4').then((newRes) => {
        expect(newRes.body.availableStock).to.eq(initialStock - 1);
      });
    });
  });
});