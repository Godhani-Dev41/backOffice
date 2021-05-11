import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;


describe('add questionnaire', function() {
  it('should validate that in league view ', async (done) => {
    await expect(browser.getCurrentUrl()).toContain('/leagues/view');
    done();
  });
  it ('should enter org settings', async (done) => {
    await element.all(by.css('.global-menu-wrapper ul li>a')).get(0).click();
    expect(browser.getCurrentUrl()).toContain('settings/about');

    done();
  });
  it('should enter registration tab', async (done) => {
    await element.all(by.css('.page-sub-navigation ul li ')).get(2).click();
    done();
  });
  it('should enter the "general questionnaire edit page', async (done) => {
      await element.all(by.css('.QuestionnaireBox a')).get(0).click();
      expect(browser.getCurrentUrl()).toContain('questions-edit');
      done();
  });
  it('should toggle the waiver option off ', async (done) => {
    await element.all(by.css('[for="mandatoryWaiver"]')).get(0).click();
    await element(by.css('.bottom-nav-bar__inner__content button.button-next')).click();
    done();
  });
  it('should toggle the waiver option on', async (done) => {
    await element.all(by.css('[for="mandatoryWaiver"]')).get(0).click();
    await element(by.css('.bottom-nav-bar__inner__content button.button-next')).click();

    done();
  });
});
