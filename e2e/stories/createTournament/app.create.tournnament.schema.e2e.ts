import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;
var until = protractor.ExpectedConditions;

describe('Create Tournament', function () {
    describe('Enter tournaments page', function () {
        it('should validate in org view', (done) => {
            expect(browser.getCurrentUrl()).toContain('leagues/view');
            done()
        })
    })
    describe('Enter tournamnet shcema modal', function () {
        it('should enter tournamnet page', async (done) => {
            await element.all(by.css('.menu-items-wrapper div ul li')).get(1).click()
            setTimeout(() => {
                expect(browser.getCurrentUrl()).toContain('tournaments/view')
                done()
            }, 1000)
        })
        it('should move to creation page', async (done) => {
            await element(by.css('a.button.pull-right')).click()
            done()
        })
    })
    describe('fill in tour schema info', function () {
        it('should enter name', async (done) => {
            browser.ignoreSynchronization = true;
            await element(by.css('[formcontrolname="name"]')).sendKeys(params.TourName, Number(new Date()));
            done()
        })
        it('should enter long description', async (done) => {
            await element.all(by.css('[formcontrolname="description"]')).get(0).sendKeys('Long')
            done()
        })
        it('should enter short description', async (done) => {
            await element.all(by.css('[formcontrolname="shortDescription"]')).get(0).sendKeys('Short')
            done()
        })
        it('should enter location', async (done) => {
            await element(by.css('[placeholder="Enter city, neighborhood, borough or full address."]')).sendKeys('San')
            let suggestLocation = await element.all(by.css('.pac-container div.pac-item')).get(0)
            browser.wait(until.presenceOf(suggestLocation), 5000, 'Element taking too long to appear in the DOM');
            await suggestLocation.click()
            done()
        })
        it('should enter sport', async (done) => {
            await browser.executeScript('window.scrollTo(0,600)')
            await element(by.css('.icon-icn-sport-football')).click()
            done()
        })
        it('should assume gender', async (done) => {
            await element.all(by.css('.GenderPicker .GenderPicker__item')).get(0).click()
            done()
        })
        it('should choose gameplay level', async (done)=>{
            await element.all(by.css('rc-level-of-play-selector .LevelOfPlayPicker div.LevelOfPlayPicker__item')).get(0).click()
            done()
        })
        it('should press create', async (done)=>{
            await element(by.css('rc-loading-btn button.button-next')).click()
            done()
        })
      it('should createSchema', async (done) => {
        setTimeout( async ()=>{
          await element(by.css('rc-action-success-modal .modal-footer .action-btn--assertive')).click();
          done();
        }, 2000);
      });
    });
    });
