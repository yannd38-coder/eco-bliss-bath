describe('Smoke Tests - Éléments principaux IHM', () => {

    //  PARTIE 1 : UTILISATEUR DÉCONNECTÉ

    it('1. En déconnecté : Vérifie les éléments de navigation (bouton connexion présent, déconnexion absent)', () => {
        cy.visit('/#/');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-logout"]').should('not.exist');
    });

    it('2. En déconnecté : Vérifie la présence des champs et du bouton sur la page de connexion', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').should('be.visible');
        cy.get('[data-cy="login-input-password"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
    });

    it('3. En déconnecté : Vérifie l’affichage du stock sur une fiche produit', () => {
        cy.intercept('GET', '**/products/4').as('getProduct');
        cy.visit('/#/products/4');
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
    });

    //PARTIE 2 : UTILISATEUR CONNECTÉ 

    it('4. En connecté : Vérifie la présence des boutons (déconnexion et panier présents)', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click();

        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
    });

    it('5. En connecté : Vérifie l’affichage du stock sur une fiche produit', () => {
        cy.visit('/#/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click();
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');

        cy.visit('/#/products/4');
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
    });

});