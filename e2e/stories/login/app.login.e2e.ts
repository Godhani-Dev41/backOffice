
// log in script

import { browser, element, by, protractor,  } from 'protractor';
import { params } from '../params.conf.js';

declare const angular;

describe('Login to BackOffice', function () {
  // beforeEach((done) => {
  //   jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  //   setTimeout(function () {
  //     console.log('inside timeout');
  //     done();
  //   }, 500);
  // });
  it("Enter Website", (done) => {
    browser.get('/login');
    done();
  })
  it('Should enter cradentials', (done) => {
    expect(browser.getCurrentUrl()).toMatch('/login');
    element(by.name('email')).sendKeys(`${params.Login_username}`)
    expect(element(by.name('email')).getAttribute('value')).toEqual('dima@roeto.co.il');
    element(by.name('password')).sendKeys(`${params.Login_password}`)
    expect(element(by.name('password')).getAttribute('value')).toEqual('444422');

    done()
  })
  it('Should Login', (done) => {
    element(by.css('.login-form button.button')).click()
      .then(() => {
        setTimeout(done, 3000)

      })
  })


});


