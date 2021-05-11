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
        it('should enter tournamnet page', async (done) => {
            await element.all(by.css('.menu-items-wrapper div ul li')).get(1).click()
            setTimeout(() => {
                expect(browser.getCurrentUrl()).toContain('tournaments/view')
                done()
            }, 1000)
        })
        it('Should check that there are tournaments listed', async (done) => {
            let tourAmount = await element.all(by.css('.leagues-viewer-wrapper div div'));
            if (tourAmount.length > 0) {
                await element.all(by.css('.leagues-viewer-wrapper div div')).get(0).click()
                done()
            }
        })
    })
    describe('enter create tournament modal', function () {

        it('should enter modal', async (done) => {
            await element(by.css('.bottom-wrapper a')).click()
            done()
        })
    })
    describe('fill out tournament page', function () {
        it('shoud validte that in tournamnet creation page', async (done) => {
            done()
        })
        it('should enter name', async (done) => {
            browser.ignoreSynchronization = true;
            
            await element(by.css('[formcontrolname="name"]')).sendKeys(params.TourName, " ", `${Number(new Date())}`)
            done()
        })
        it('should Enter start date', async (done) => {
            await element.all(by.css('.date-select-btn i.icon-rc-calendar')).get(0).click()
            await element.all(by.css('tbody td')).get(27).click()
            done()
        })
        it('should enter end date', async (done) => {
            await element.all(by.css('.date-select-btn i.icon-rc-calendar')).get(1).click()
            await element.all(by.css('tbody td')).get(30).click()
            done()
        })
        it('should add registration start date', async (done) => {
            // await browser.executeScript('window.scrollTo(0,50)')
            await element.all(by.css('.rc-date-input-wrapper input')).get(0).click()
            await element.all(by.css('tbody td')).get(23).click()
            done()
        })
        it('should add regisrtation end date', async (done)=>{
            await element.all(by.css('.rc-date-input-wrapper input')).get(1).click()
            await element.all(by.css('tbody td')).get(25).click()
            done()  
        })
        it('should add individual pirce', async (done)=>{
            await element(by.css('[formcontrolname="individualPrice"]')).sendKeys(10)
            done()
        })
        it('should add consolation match', async (done)=>{
            await browser.executeScript('window.scrollTo(0,200)')
            await element(by.css('[formcontrolname="addConsolationRound"]')).click()    
            done()        
        })
        it('should enter venue', async (done)=>{
            await browser.executeScript('window.scrollTo(0,500)')
            await element(by.css('rc-location-search-input input')).sendKeys('תל אביב')
            done()
        })
        it('should give time frame', async (done)=>{
            await element.all(by.css('.days-select li')).get(3).click()
            done()
        })
        it('should press next ' ,async (done)=>{
            await element(by.css('rc-loading-btn .button-next')).click()
            done()
        })
    })
    describe('publish the new tournament',function(){
        it('should press publish', async (done)=>{
            setTimeout( async ()=>{
                await element(by.css('rc-action-success-modal .modal-footer .action-btn--assertive')).click()
                done()
            },2000)
        })
    })
})