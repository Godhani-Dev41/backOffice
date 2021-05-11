import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('test drag and drop of teams between divisons', ( ) => {
  describe('validate that inside an org', ( ) => {
    it('should validate inside an org', (done) => {
      expect(browser.getCurrentUrl()).toContain('leagues/view');
      done() ;
    });
  });
  describe('Enter teams tab', ( ) => {
    it('should enter the first league',  async (done) => {
      await element.all(by.css('.leagues-viewer-wrapper div div')).get(0).click();
      await expect(browser.getCurrentUrl()).toContain('leagues/view/');
      done() ;
    });
    it('should enter season', async (done) => {
      await element.all(by.css('.menu-list__inner li')).get(0).click();
      await expect(browser.getCurrentUrl()).toContain('/season/');
      done();
    });
    it('should enter teams tab', async (done) => {
      await element.all(by.css('rc-league-page-season .page-sub-navigation ul li')).get(1).click();
      await expect(browser.getCurrentUrl()).toContain('/teams');
      done();
    });
  });
  describe('should move team to a division',  ( ) => {
    it('should open team creation modal', function (done) {
      element.all(by.css('.title-button-group a')).get(0).click()
        .then(function () { done(); });
    });
      it('should create new team',  async (done) => {
        const tempTeamName = Number(new Date());
        element(by.css('[formcontrolname="name"]')).sendKeys('Team ' + tempTeamName );
        const button = element(by.css('[ng-reflect-text="ADD NEW TEAM"]'));
        button.click()
          .then(function () {
            setTimeout(() => { done(); }, 15000);
          });
      });
      it('should drag a team', async (done) => {
          const latestTeam =  await element.all(by.css('.box-item')).get(0);
          console.log(latestTeam);
          browser.executeScript(() => {
            'let boxes = document.querySelectorAll(.box-item); boxes[0].style.border="1px solid red"';
         });
          browser.actions().dragAndDrop(latestTeam,  {x: 0, y: 250}).perform();
      });
  });
});
