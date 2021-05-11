import { browser, element, by, protractor } from 'protractor'
import { params } from '../params.conf.js';

declare const angular;


describe('Sign-up organization', function () {
  it('should open loginpage', (done) => {
    browser.get('/login');

    expect(browser.getCurrentUrl()).toMatch('/login')
    done()

<<<<<<< HEAD
    })
    it('Should enter Signup form', (done) => {
        element(by.css('.login-bottom-wrapper button')).click()
            .then(() => {
                done()
            })
    })
    it('Should enter signup Info', (done) => {
        let date = Number(new Date());
        element(by.css('[ng-reflect-name="name"]')).sendKeys(`${params.CopmanyName}`);
        element(by.css('[ng-reflect-name="email"]')).sendKeys(`${params.Signup_username}${date}@reccenter.me`)
        element(by.css('[formcontrolname="password"]')).sendKeys(`${params.Login_password}`);
        element(by.css('[ng-reflect-name="passwordRepeat"]')).sendKeys(`${params.Login_password}`)
        done()
    })
    it('Should Press sign up ', async (done) => {
        await element(by.css('[formcontrolname="termsAgreed"]')).click()

        await element(by.css('[type="submit"]')).click()

        done()

    })
=======
  })
  it('Should enter Signup form', (done) => {
    element(by.css('.login-bottom-wrapper button')).click()
      .then(() => {
        done()
      })
  })
  it('Should enter signup Info', (done) => {
    let date = Number(new Date());
    element(by.css('[ng-reflect-name="name"]')).sendKeys(`${params.CopmanyName}`);
    element(by.css('[ng-reflect-name="email"]')).sendKeys(`${params.Signup_username}${date}@reccenter.me`)
    element(by.css('[formcontrolname="password"]')).sendKeys(`${params.Login_password}`);
    element(by.css('[ng-reflect-name="passwordRepeat"]')).sendKeys(`${params.Login_password}`)
    done()
  })
  it('Should Press sign up ', async (done) => {
    await element(by.css('[formcontrolname="termsAgreed"]')).click()

    await element(by.css('[type="submit"]')).click()

    done()

  })
>>>>>>> sprint/2.0.0

})
