describe('Tests API - Eco Bliss Bath', () => {
  const baseUrl = 'http://localhost:8081';

  // Récuperation d'un token propre quand un test authentifié en a besoin
  const getAuthToken = () => {
    return cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).its('body.token');
  };

  it('1. Accès hors connexion - Garantir qu’aucune authentification n’est active', () => {
    // Vidage de la session
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/orders/add`,
      body: { product: 4, quantity: 1 },
      failOnStatusCode: false
    }).then((res) => {
      // Vérification du refus d'accès (401 Unauthorized ou 403 Forbidden)
      expect([401, 403]).to.include(res.status);
    });
  });

  it('2. Accès avec authentification', () => {
    getAuthToken().then((token) => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/orders/add`,
        headers: { Authorization: `Bearer ${token}` },
        body: { product: 4, quantity: 1 }
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });

  it('3. GET /products - Récupération de la liste des produits', () => {
    cy.request('GET', `${baseUrl}/products`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('4. POST /reviews - Envoi d\'un avis authentifié', () => {
    const xssPayload = '<script>alert("xss")</script>';

    getAuthToken().then((token) => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/reviews`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          title: 'Avis Test',
          comment: xssPayload,
          rating: 5
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body).to.have.property('comment');
      });
    });
  });

  it('5. PUT /orders/add - Ajout de produit avec quantité invalide', () => {
    getAuthToken().then((token) => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/orders/add`,
        headers: { Authorization: `Bearer ${token}` },
        body: {
          product: 4,
          quantity: -1
        },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });
  });
}); 