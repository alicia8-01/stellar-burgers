/// <reference types="cypress" />

const BUN_NAME = 'Тестовая булка';
const MAIN_NAME = 'Тестовая начинка';

describe('Основная страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Добавление ингредиента из списка в конструктор бургера', () => {
    cy.visit('/');

    cy.wait('@getIngredients');
    cy.contains('[data-cy="ingredient-card"]', BUN_NAME).as('bunCard');

    cy.get('@bunCard').find('button').contains('Добавить').click();
    cy.get('@bunCard').find('[data-cy="ingredient-counter"]').should('exist');

    cy.contains('button', 'Оформить заказ').should('exist');
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.visit('/');

    cy.wait('@getIngredients');
    cy.contains('[data-cy="ingredient-card"]', BUN_NAME).as('bunCard');
    cy.get('@bunCard').find('[data-cy="ingredient-link"]').click();

    cy.url().should('include', '/ingredients/');
    cy.contains(BUN_NAME).should('exist');

    cy.contains('h3', 'Детали ингредиента')
      .parent()
      .find('button[type="button"]')
      .click({ force: true });

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('[data-cy="ingredient-card"]', BUN_NAME).as('bunCardAgain');

    cy.get('@bunCardAgain').find('[data-cy="ingredient-link"]').click();
    cy.url().should('include', '/ingredients/');

    cy.contains(BUN_NAME).should('exist');

    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });

  it('Создание заказа с моковыми данными и очистка конструктора бургера', () => {
    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.contains('[data-cy="ingredient-card"]', BUN_NAME).as('bunCard');

    cy.get('@bunCard').find('button').contains('Добавить').click();

    cy.contains('Начинки').click();
    cy.contains('[data-cy="ingredient-card"]', MAIN_NAME).as('mainCard');

    cy.get('@mainCard').find('button').contains('Добавить').click();

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');
    cy.contains('12345').should('exist');
    cy.get('body').type('{esc}');
    cy.contains('12345').should('not.exist');

    cy.contains('[data-cy="ingredient-card"]', BUN_NAME).within(() => {
      cy.get('[data-cy="ingredient-counter"]').should('not.exist');
    });

    cy.contains('[data-cy="ingredient-card"]', MAIN_NAME).within(() => {
      cy.get('[data-cy="ingredient-counter"]').should('not.exist');
    });
  });
});
