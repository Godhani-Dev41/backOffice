import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
import {elementAt} from "rxjs/operator/elementAt";
declare const angular;

describe('create Division', ( ) => {
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
  describe('divison creation', ( ) => {
    let divisionLength;

    it('should open division modal', async (done) => {
      setTimeout(() => {
         element.all(by.css('.title-button-group a')).get(1).click();
        done();
      }, 850);
    });
    it('should add a new division input ', async (done) => {
      await element(by.css('rc-create-division-modal .modal-body')).click();
      await element(by.css(' rc-create-division-modal .modal-body form a')).click();
        done();
    });
    it('should add division name', async (done) => {
        element.all(by.css('.at-divisionCountItem'))
          .then((divisions) => {
          divisionLength = divisions.length;
          console.log(divisionLength, typeof (divisionLength));
            let latestDivisionInput = divisionLength - 1;
            element.all(by.css('.at-divisionCountItem')).get(latestDivisionInput).sendKeys(`Division ${divisionLength}`);
            done();
      });
    });
    it('should save new division', async (done) => {
        await  element.all(by.css('rc-create-division-modal .modal-footer rc-loading-btn')).click();
        done();
    });
  });
}) ;
