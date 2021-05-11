import { browser, element, by, protractor } from 'protractor';
import { params } from './../params.conf.js';
declare const angular;
describe('insert password validation mismatch',function(){
  it('should open loginpage', (done) => {
    browser.get('/login');
    expect(browser.getCurrentUrl()).toMatch('/login')
    done()

  })
  it('Should enter Signup form', (done) => {
    element(by.css('.login-bottom-wrapper button')).click()
      .then(() => {
        done()
      })
  })
  it('Should enter signup Info', (done) => {
    let date = Number(new Date());
    element(by.css('[ng-reflect-name="name"]')).sendKeys(`${params.CopmanyName}`)
    element(by.css('[ng-reflect-name="email"]')).sendKeys(`${params.FirstName}${date}@reccenter.me`)
    element(by.css('[formcontrolname="password"]')).sendKeys(`${params.Login_password}`);
    element(by.css('[ng-reflect-name="passwordRepeat"]')).sendKeys(`${params.Login_password}1`);
    element(by.css('.styled-checkbox')).click().then(()=>{done()})
  })
  it('should press continue',(done)=>{
    element(by.css('.buttons-row .button-full')).click()
    setTimeout(()=>{
      done()
    },2000)
  })
})
