import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;
var until = protractor.ExpectedConditions;

describe('Create an Event', function () {
    it('should enter events page', (done) => {
        element(by.css('[ng-reflect-router-link="events"]')).click()
            .then(() => {
                done();
            });
    });
    it('Should enter event creator page', (done) => {
        element(by.css('[ng-reflect-router-link="/client/events/event-creator"]')).click()
            .then(() => {
                done();
            });
    });

    it('should fille out name', (done) => {
      browser.ignoreSynchronization = true;
      element.all(by.css('.form__section .input-group .input-wrapper input.input')).get(0).sendKeys(`${params.EventName}${Number(params.StartDate)}`);
        browser.ignoreSynchronization = false;
        done();
    });
    it('Should enter description', (done) => {
        browser.ignoreSynchronization = true;

        element(by.css('[formcontrolname="description"]')).sendKeys('Test description');
        done();
    });
    it('Should choose a sport', ((done) => {
        element.all(by.css('.icon-icn-sport-basketball')).get(0).click()
            .then(() => {
                let picked = element.all(by.css('.SportPicker .SportPicker__item')).get(1);
                expect(picked.getAttribute('class')).toContain('active');
                done();
            });
    })
    );
    it('Should enter location', (done) => {
        element(by.css('[placeholder="Enter city, neighborhood, borough or full address."]')).sendKeys('San')
        let suggestLocation = element.all(by.css('.pac-container div.pac-item')).get(0)
        browser.wait(until.presenceOf(suggestLocation), 5000, 'Element taking too long to appear in the DOM');
        suggestLocation.click()
            .then(() => {
                done();
            });
    });
    it('should add start day', (done) => {
        let startDate = element.all(by.css('.icon-icn-sport-basketball')).get(0);
        browser.executeScript('arguments[0].scrollIntoView();', startDate.getWebElement());
        setTimeout(() => {
            let cal = element(by.css('.rc-date-input-wrapper'))
            browser.wait(until.presenceOf(cal), 5000, 'Element taking too long to appear in the DOM');

            done();
        }, 2000);

    });
    it('should add start day', (done) => {
        browser.executeScript('window.scrollTo(0, 500);');

        element.all(by.css('.date-select-btn i.icon-rc-calendar')).get(0).click();
        setTimeout(() => {
            element.all(by.css('tbody td')).get(30).click().then(() => {
                done();
            });

        }, 2000);
    });
    it('should validate that end date is same as start date ', (done) => {
        done();
    });
    it('Should add event time start', (done) => {
        element.all(by.css('.rc-date-input-wrapper input')).get(0).click()
            .then(() => {
                element.all(by.css('.glyphicon.glyphicon-chevron-up')).get(0).click().then(() => { return })
                element.all(by.css('.glyphicon.glyphicon-chevron-up')).get(1).click().then(() => { return })
                element(by.css('td button.btn')).click()
                    .then(() => { done(); });

            });

    });
    it('should assume my gender', ((done) => {
        element.all(by.css('.GenderPicker .GenderPicker__item')).get(0).click()
            .then(() => { done(); });
    })
    );
    it('Should press next', (done) => {
        element(by.css('.bottom-nav-bar button.button-next')).click()
            .then(() => {
                done();
            });
    });
    it('Should publish the event', (done) => {
        setTimeout(() => {
            element(by.css('.modal-content .action-btn--assertive ')).click()
                .then(() => {
                    browser.ignoreSynchronization = false;
                    done();
                });
        }, 2000);

    });
});
