import { browser, element, by, protractor } from 'protractor'

declare const angular;
describe('Check for league list on the left menu bar', function () {
    var EC = protractor.ExpectedConditions;

    it('should Check if there any leagues in list', (done) => {
        let boxes = element.all(by.css('.leagues-viewer-wrapper')).get(0)
        browser.wait(EC.visibilityOf(boxes));
        element.all(by.css('.league-box'))
            .then((res) => {
                expect(res.length).toBeGreaterThan(0)
                console.log(res.length)
                done()
            })

    })
})
