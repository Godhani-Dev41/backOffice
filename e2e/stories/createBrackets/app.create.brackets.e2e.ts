import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;
var until = protractor.ExpectedConditions;

describe('Create Brackets', function () {
  describe('enter a tournament', function () {
    it('should enter tournament page', async (done) => {
      await element.all(by.css('.menu-list ul li')).get(1).click()
      setTimeout(() => {
        expect(browser.getCurrentUrl()).toContain('/tournaments/view')
        done()
      }, 3000)
    })

    it('should enter a tournament schema', async (done) => {
      await element.all(by.css('.leagues-viewer-wrapper div div ')).get(0).click()
      setTimeout(() => {
        expect(browser.getCurrentUrl()).toContain('/tournaments/view')
        expect(browser.getCurrentUrl()).toContain('/details')
        done()
      }, 1200)
    })
    it('should enter a sepcfic tounrmanet', async (done) => {
      await element.all(by.css('.menu-list__inner li')).get(0).click()
      setTimeout(() => {
        expect(browser.getCurrentUrl()).toContain('/dashboard')
        done()
      }, 1000)
    })
  })
  describe('create the brackets', function(){
    it('should enter brackets tab', async (done) => {
      await element.all(by.css('.page-sub-navigation ul li')).get(1).click();
      expect(browser.getCurrentUrl()).toContain('/brackets');
      setTimeout(() => {
        done();
      }, 2000);
    });
    it('should enter tourmanet generate', async (done) => {
      await element(by.css('.at-generateBrackets')).click();
      expect(browser.getCurrentUrl()).toContain('/generate-schedule');
      done();
    });
    it('should generate the brackets', async (done) => {
      await element(by.css('.bottom-nav-bar__inner .bottom-nav-bar__inner__content button.button-next')).click()
      setTimeout(() => {
        let brackets =   element(by.css('.TournamentBrackets'));
        browser.wait(until.presenceOf(brackets), 7000, 'Element taking too long to appear in the DOM');
        expect (brackets.length).toBeGreaterThan(0);
        done();
      }, 500);

    })
    it('should delete brackets', async (done) => {
      await element(by.css('rc-tournament-brackets-page a.button-assertive--inverted')).click()
      await element(by.css('.modal-footer button.button-success')).click()
      done();
    });
  });
});
