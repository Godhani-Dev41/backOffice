import { browser, element, by, protractor } from 'protractor';
import { params } from '../params.conf.js';
declare const angular;

describe('Create new season', function () {
  var EC = protractor.ExpectedConditions;


  describe('Enter league', function () {
    it('should validate that in league page', (done) => {
      expect(browser.getCurrentUrl()).toMatch('/client/leagues/view');
      done()
    })
    it('should enter a league', (done) => {
      let chosenLeague = element.all(by.css('.leagues-viewer-wrapper div div')).get(0);
      browser.wait(EC.visibilityOf(chosenLeague));
      chosenLeague.click()
        .then(() => {
          expect(browser.getCurrentUrl()).toContain('leagues/view');

          done();
        });
    });

  });
});
describe('Enter season creation', function () {
  it('should enter create season pages', (done) => {
    let newSeasonBtn = element(by.css('[ng-reflect-router-link="../basic"]'))
    newSeasonBtn.click()
      .then(() => {
        done()
      })
  })
})
describe('Create Season', function () {
  it('should enter name', (done) => {
    element(by.css('[formcontrolname="name"]')).sendKeys(`${params.SeasonName}${Number(new Date())}`);
    done()
  })

  it('should enter description', (done) => {
    element(by.css('[formcontrolname="description"]')).sendKeys('Test');
    done()
  })

  it('should press next', (done) => {
    element(by.css('.bottom-nav-bar__inner__content button')).click()
      .then(() => {
        done()
      })
  })

  it('should add start date  date', (done) => {
    element.all(by.css('.date-select-btn i.icon-rc-calendar')).get(0).click()
      .then(() => {
        setTimeout(() => {
          element.all(by.css('tbody td')).get(19).click().then(() => {
            done()
          })
        }, 2000)
      })

  })

  it('should choose end date', (done) => {
    element.all(by.css('.date-select-btn i.icon-rc-calendar')).get(1).click()
      .then(() => {
        setTimeout(() => {
          element.all(by.css('tbody td')).get(22).click().then(() => {
            done()
          })
        }, 2000)
      })
  })

  it('should add regualr registration start and end date', (done) => {
    browser.executeScript('window.scrollTo(0,200)')
      .then(() => {
        element.all(by.css('.rc-date-input-wrapper input')).get(0).click()
          .then(() => {
            element.all(by.css('tbody td')).get(17).click().then(() => {
              element.all(by.css('.rc-date-input-wrapper input')).get(1).click()
                .then(() => {
                  element.all(by.css('tbody td')).get(17).click().then(() => {
                    done()
                  })
                })
            })
          })
      })
  })
  it('should add price', (done) => {
    element(by.css('[formcontrolname="individualPrice"]')).sendKeys(0)
    done()
  })
  it('should go to next page', (done) => {
    element(by.css('.bottom-nav-bar__inner__content .button-next')).click().then(() => { done() })
  })

  it('should add venue ', (done) => {
    let locationInput = element(by.css('rc-location-search-input input'))
    locationInput.sendKeys('בתל אבי')
    done()

  })
  it('should check one day of the week', (done) => {
    element.all(by.css('.ActivityTimeWidget__times-wrapper__item ul.days-select li')).get(2).click()
      .then(()=>{
        done()
      })
  })
  it('should press complete', (done) => {
    element(by.css('.button-next')).click().then(()=>{
      setTimeout(() => {
        done()
      }, 2000)

    });
  });


});
describe('publish season', function(){
  it('should publish season',  async (done) => {
    await  element.all(by.css('rc-action-success-modal div.success-modal div.modal-dialog  div.modal-footer div ')).get(0).click();
    done();
  });
});
