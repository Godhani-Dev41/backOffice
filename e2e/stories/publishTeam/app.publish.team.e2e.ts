import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;
var until = protractor.ExpectedConditions;

describe('Publish a team', function () {
    describe('choose season', function () {
        it('should enter the first season', async (done) => {
            await element.all(by.css('.menu-list__inner li')).get(0).click();
            expect(browser.getCurrentUrl()).toContain('/season/');
            done();
        })
    })
    describe('publush roster', function () {
        it('should enter team tab', async (done) => {
            await element.all(by.css('.page-sub-navigation ul li')).get(1).click();
            await expect(browser.getCurrentUrl()).toContain('/teams');
            done()
        })
        it('should publish the team roster', async (done)=>{
            await element(by.css('rc-loading-btn button.button-edit-success')).click()
            done()
        })
    })
})
