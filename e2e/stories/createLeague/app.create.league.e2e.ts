import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('create a new league', function () {
  var until = protractor.ExpectedConditions;

  describe('enter leauge creation page', function () {
    it('Should check that in leagues view', (done) => {
      expect(browser.getCurrentUrl()).toMatch('/client/leagues/view')
      done()
    })
    it('should press league creation button', (done) => {
      element(by.css('[href="/client/leagues/league-creator"]')).click().then(() => { done() })
    })
  })
  describe('fill in league details', function () {
    it('should fill name', (done) => {
      let ms = Number(new Date())
      element(by.css('[formcontrolname="name"]')).sendKeys(`${params.LeagueName}${ms}`)
      done()
    })
    it('should choose sport', (done) => {
      element(by.css('.icon-icn-sport-football')).click().then(() => { done() })
    })
    it('should choose location', (done) => {
      element(by.css('[placeholder="Enter city, neighborhood, borough or full address."]')).click()
        .then(() => {
          element(by.css('[placeholder="Enter city, neighborhood, borough or full address."]')).sendKeys('San')
          let suggestLocation = element.all(by.css('.pac-container div.pac-item')).get(0)
          browser.wait(until.presenceOf(suggestLocation), 5000, 'Element taking too long to appear in the DOM');
          suggestLocation.click()
            .then(() => {
              setTimeout(() => {
                let nextBtn = element(by.css('.bottom-nav-bar__inner__content .button-assertive'))
                browser.executeScript('arguments[0].scrollIntoView();', nextBtn.getWebElement())
                nextBtn.click().then(() => { done() })
              }, 3000)
            })
        })
    })

    it('should enter short and long  description', (done) => {
      let shortD = element(by.css('[formcontrolname="shortDescription"]'))
      browser.wait(until.presenceOf(shortD), 10000, 'Element taking too long to appear in the DOM');
      element(by.css('[formcontrolname="shortDescription"]')).sendKeys('this is a short description')
      element(by.css('[formcontrolname="description"]')).sendKeys('this is a long description')
      done()
    })
    it('should use default waiver', (done) => {
      element(by.css('.rc-toggle-wrapper')).click().then(() => { done() })
    })
    it('should press next', async (done) => {
      await element.all(by.css('.bottom-nav-bar__inner__content button')).get(1).click();
      done();
    });
    it('should choose a gender', async (done) => {
      browser.ignoreSynchronization = true;
      await element.all(by.css('rc-gender-picker div.GenderPicker div.GenderPicker__item')).get(0).click();
      done();
    });
    it('should choose level of play', async (done) => {
      await element.all(by.css('rc-level-of-play-selector div.LevelOfPlayPicker div.LevelOfPlayPicker__item')).get(0).click();
      done();
    });
    it('should create and publish the league', async (done) => {
      await element(by.css('rc-loading-btn button.button-next.button-dark')).click();
      setTimeout(() => {
        element.all(by.css('rc-action-success-modal div.modal-footer div.action-btn')).get(0).click();
      }, 1000);
      browser.ignoreSynchronization = false;
      done();
    });
  });
});

