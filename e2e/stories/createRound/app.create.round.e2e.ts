
import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('create round', function(){
  describe('enter schedule tab', function(){
    it('should enter season', (done) => {
      element.all(by.css('.menu-list__inner li')).get(0).click()
        .then(() => {
          done();
        });
    });
    it('should validate that in dashboard', (done) => {
      setTimeout(() => {
        expect(browser.getCurrentUrl()).toContain('/dashboard');
        done();
      }, 500);

    });
    it('should enter schedule tab', async (done) => {
      await element.all(by.css('.page-sub-navigation ul li')).get(2).click()
      done();

    });

  });
  describe('Create the new round', function(){

    it('should open create and edit round modal', async (done) => {
      await element(by.cssContainingText('.matches-page-wrapper div .col-md-8 button', 'CREATE & EDIT ROUNDS')).click();
      done();

    });
    it('should add a new round', (done) => {
      let addRoundBtn= element(by.css('.add-new-round-btn'));
      browser.executeScript('arguments[0].scrollIntoView();', addRoundBtn.getWebElement());
      addRoundBtn.click()
        .then(() => {
          done();
        });
    });
    it('should enter new round name', async (done) => {
      let rounds = await element.all(by.css('rc-round-edit-modal .RoundBox'));
      let inputlocation = rounds.length - 1;
      element.all(by.css('rc-round-edit-modal .RoundBox input')).get(inputlocation).sendKeys('Latest Rounds');
      done();
    });
  });
});
