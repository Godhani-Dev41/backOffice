import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('create Team', function () {
    var EC = protractor.ExpectedConditions;
    
    describe('enter a season', function () {
        it('should enter a season', (done) => {
            let season = element.all(by.css('.menu-list__inner li')).get(0);
            season.click()
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain('leagues/view');
                    console.log('in season page')
                    done()
                })
        })
    })
    describe('enter team tab', function () {
        it('should enter team tab', (done) => {
            element.all(by.css('rc-league-page-season .page-sub-navigation ul li')).get(1).click()
                .then(() => {
                    expect(browser.getCurrentUrl()).toContain('/teams')
                    console.log('in teams tab')
                    done()
                })
        })
    })
    describe('Create Team', function () {
        it('should open team creation modal', (done) => {
            element(by.css('.title-button-group a')).click()
            .then(()=>{done()})
        })
        it('Should enter team name and save',(done)=>{
            let tempTeamName=Number(new Date())
            element(by.css('[formcontrolname="name"]')).sendKeys(`Team ${tempTeamName}'`);
            let button = element(by.css('[ng-reflect-text="ADD NEW TEAM"]'))
            button.click()
            .then(()=>{
            done()
            })
       })  
    })
})