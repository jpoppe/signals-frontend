// <reference types="Cypress" />
import * as createSignal from '../../support/commandsCreateSignal';
import { CREATE_SIGNAL, VERKEERSLICHT } from '../../support/selectorsCreateSignal';
import { MANAGE_SIGNALS } from '../../support/selectorsManageIncidents';
import questions from '../../fixtures/questions/questions.json';
import { generateToken } from '../../support/jwt';

const fixturePath = '../fixtures/signals/verkeerslicht.json';

describe('Create signal "Verkeerslicht" and check signal details', () => {
  describe('Create signal Verkeerslicht', () => {
    before(() => {
      cy.postSignalRoutePublic();
      cy.getMapRoute();
      cy.visit('incident/beschrijf');
    });

    it('Should create the signal', () => {
      createSignal.setDescriptionPage(fixturePath);
      cy.contains('Volgende').click();

      createSignal.checkSpecificInformationPage(fixturePath);
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Is de situatie gevaarlijk?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Check on visibility of the message to make a phone call directly after selecting one of the first four options
      const messageCallDirectly = questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_gevaar.answers;

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonAanrijding).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonOpGrond).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonDeur).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonLosseKabels).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly);
      cy.get(VERKEERSLICHT.radioButtonNietGevaarlijk).check({ force: true }).should('be.checked');
      cy.contains(messageCallDirectly).should('not.exist');

      // Click on next to invoke error message
      cy.contains('Volgende').click();
      cy.get(CREATE_SIGNAL.labelQuestion)
        .contains('Welk verkeerslicht werkt niet juist?')
        .siblings(CREATE_SIGNAL.errorItem)
        .contains('Dit is een verplicht veld');

      // Check all options for voetganger
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_welk.label).should('be.visible');
      cy.get(VERKEERSLICHT.radioButtonTypeVoetganger).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_voetganger.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerBlindentikker)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Blindentikker werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxVoetgangerAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Fiets
      cy.get(VERKEERSLICHT.radioButtonTypeFiets).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Auto
      cy.get(VERKEERSLICHT.radioButtonTypeAuto).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_fiets_auto.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoGroenLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Groen licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoDuurtLang)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Duurt (te) lang voordat het groen wordt')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxFietsAutoAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');

      // Check all options for Tram of bus
      cy.get(VERKEERSLICHT.radioButtonTypeTramBus).check({ force: true }).should('be.checked');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_probleem_bus_tram.label).should('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Rood licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramOranjeLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Oranje/geel licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWitLicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Wit licht werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramWaarschuwingslicht)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Waarschuwingslicht tram werkt niet')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramAnders)
        .parent()
        .parent()
        .siblings()
        .should('have.text', 'Anders')
        .and('be.visible');
      cy.get(VERKEERSLICHT.checkBoxTramRoodLicht).check();

      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_rijrichting.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputRijrichting).eq(0).type('Richting centrum');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.label).should('be.visible');
      cy.contains(questions.wegenVerkeerStraatmeubilair.extra_verkeerslicht_nummer.subtitle).should('be.visible');
      cy.get(VERKEERSLICHT.inputNummerVerkeerslicht).eq(1).type('365');

      cy.contains('Volgende').click();

      createSignal.setPhonenumber(fixturePath);
      cy.contains('Volgende').click();

      createSignal.setEmailAddress(fixturePath);
      cy.contains('Volgende').click();

      cy.wait('@getMap');
      createSignal.checkSummaryPage(fixturePath);
      createSignal.checkQuestions(fixturePath);
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
      cy.getManageSignalsRoutes();
      cy.getSignalDetailsRoutesById();
      cy.visit('/manage/incidents/');
      cy.waitForManageSignalsRoutes();
    });

    it('Should show the signal details', () => {
      createSignal.openCreatedSignal();
      cy.waitForSignalDetailsRoutes();

      createSignal.checkAllDetails(fixturePath);
    });
  });
});