import { CREATE_SIGNAL, WONEN_LEEGSTAND } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import { ERROR_MESSAGES } from '../../support/texts';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';
import signal from '../../fixtures/signals/wonenLeegstand.json';
import * as routes from '../../support/commandsRouting';
import * as createSignal from '../../support/commandsCreateSignal';

describe('Create signal "Wonen leegstand" and check signal details', () => {
  describe('Create signal wonen leegstand', () => {
    before(() => {
      routes.postSignalRoutePublic();
      routes.stubPreviewMap();
      routes.stubMap();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(signal);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(signal);
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Weet u wie de eigenaar is van de woning?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains(ERROR_MESSAGES.mandatoryField);
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Hoe lang staat de woning al leeg?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains(ERROR_MESSAGES.mandatoryField);
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Wordt de woning af en toe nog gebruikt?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains(ERROR_MESSAGES.mandatoryField);

      // Input specific information
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_eigenaar.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.inputEigenaar).type('A. Hitchcock');

      cy.contains(questions.wonen.extra_wonen_leegstand_periode.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegZesMaandenOfLanger).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegMinderDanZesMaanden).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonLeegPeriodeWeetIkNiet).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_woning_gebruik.label).should('be.visible');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktWeetIkNiet).check({ force: true }).should('be.checked');
      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktNee).check({ force: true }).should('be.checked');
      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('not.exist');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('not.exist');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('not.exist');

      cy.get(WONEN_LEEGSTAND.radioButtonGebruiktJa).check({ force: true }).should('be.checked');

      cy.contains(questions.wonen.extra_wonen_leegstand_naam_persoon.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_activiteit_in_woning.label).should('be.visible');
      cy.contains(questions.wonen.extra_wonen_leegstand_iemand_aanwezig.label).should('be.visible');

      // Check if inputfields are optional
      cy.contains('Volgende').click();
      cy.url().should('include', '/incident/telefoon');
      cy.contains('Vorige').click();
      cy.url().should('include', '/incident/vulaan');

      cy.get(WONEN_LEEGSTAND.inputNaam).type('J. Aniston');
      cy.get(WONEN_LEEGSTAND.inputWatDoetPersoon).type('Deze persoon zit de hele dag te acteren');
      cy.get(WONEN_LEEGSTAND.inputTijdstip).type('Vooral in de avond');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(signal);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(signal);
      cy.contains('Volgende').click();

      createSignal.checkSummaryPage(signal);
      cy.contains('Verstuur').click();
      cy.wait('@postSignalPublic');
      cy.get(MANAGE_SIGNALS.spinner).should('not.exist');

      createSignal.checkThanksPage();
      createSignal.saveSignalId();
    });
  });
  describe('Check data created signal', () => {
    before(() => {
      localStorage.setItem('accessToken', generateToken('Admin', 'signals.admin@example.com'));
      routes.getManageSignalsRoutes();
      routes.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      routes.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      routes.stubPreviewMap();
      createSignal.openCreatedSignal();
      routes.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(signal);
    });
  });
});
