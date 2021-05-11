import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;
let  latestLeague;
describe('Enter League', function (){
  var EC = protractor.ExpectedConditions;

  it('should validate that in league page', (done) => {
    expect(browser.getCurrentUrl()).toMatch('/client/leagues/view');
    done();
  });
  it('should enter a league', (done) => {
    let chosenLeague = element.all(by.css('.leagues-viewer-wrapper div div')).get(0);
    browser.wait(EC.visibilityOf(chosenLeague));
    latestLeague = element.all(by.css('.leagues-viewer-wrapper div div div.league-info h3')).get(0).getText();
    chosenLeague.click()
      .then(() => {
        element(by.css('.page-header h3')).getText()
          .then((titleText) => {
            expect(titleText).toMatch(latestLeague);
            done();
          });
      });

  });
});
