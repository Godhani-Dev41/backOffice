import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('add membership payment to org', function () {

    it('should validate that in league view ', async (done) => {
         await expect(browser.getCurrentUrl()).toContain('/leagues/view');
        done();
    });
    it ('should enter org settings', async (done) => {
        await element.all(by.css('.global-menu-wrapper ul li>a')).get(0).click();
        done();
    });
    it('should move to membership tab', async (done) => {
        await element.all(by.css('.page-sub-navigation ul li ')).get(3).click();
        done();
    });
    it('should toggle on membership payment and save', async (done) => {
        await element(by.css('.MembershipSettingsBox div.rc-toggle-wrapper ')).click();
        await element(by.css('.bottom-nav-bar__inner__content .button-next')).click();
        done();
    });
    it('should toggle off membership payment and save', async (done) => {
        await element(by.css('.MembershipSettingsBox div.rc-toggle-wrapper ')).click();
        await element(by.css('.bottom-nav-bar__inner__content .button-next')).click();
        done();
    });
});
