// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 41000,
  suites:{
    login:['./e2e/stories/login/app.login.e2e.ts'],
    signup:['./e2e/stories/signup/app.signup.e2e.ts'],
    invalidSingup:['./e2e/stories/signup/app.invalid.signup.e2e.ts'],
    checkLeagues:['./e2e/stories/login/app.login.e2e.ts', "./e2e/stories/leagueList/app.leagueList.e2e.ts"],
    createLeague:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createLeague/app.create.league.e2e.ts'],
    createSeason:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createSeason/app.create.season.e2e.ts'],
    createEvent:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createEvent/app.create.event.e2e.ts'],
    createTeam:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/chooseLeague/app.choose.league.e2e.ts','./e2e/stories/createTeam/app.create.team.e2e.ts'],
    addRound:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/chooseLeague/app.choose.league.e2e.ts','./e2e/stories/createRound/app.create.round.e2e.ts'],
    createDivision:['./e2e/stories/login/app.login.e2e.ts', './e2e/stories/addDevision/app.create.devision.e2e.ts'] ,
    // moveTeamDivisions:['./e2e/stories/login/app.login.e2e.ts', './e2e/stories/MoveTeamDivisions/app.move.teams.division.e2e.ts'],
    createTournament:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createTournament/app.create.tournament.e2e.ts'],
    createBrackets:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createBrackets/app.create.brackets.e2e.ts'],
    createTourSchema:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/createTournament/app.create.tournnament.schema.e2e.ts'],
    publishTeam:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/chooseLeague/app.choose.league.e2e.ts','./e2e/stories/publishTeam/app.publish.team.e2e.ts'],
    addMembership:['./e2e/stories/login/app.login.e2e.ts','./e2e/stories/addMembership/app.membership.payment.e2e.ts'],
    addQuestionnaire:["./e2e/stories/login/app.login.e2e.ts",'./e2e/stories/addquestionnaire/app.questionnaire.e2e.ts']
  },
  capabilities: {
    'browserName': 'chrome',
	// 'chromeOptions': { args: ['--disable-web-security', "--headless", "--disable-gpu"]}, },
		'chromeOptions': {args: ['--disable-web-security', "--disable-gpu",'--window-size=1920,1080']},},

  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },

};
