
export const APIroot = 'http://localhost:3000/v1'
export const AuthTokenUser1 = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlUGljdHVyZUlkIjoiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vMTAyMTM0Mjc0MDMwNTY1NzIvcGljdHVyZT90eXBlPWxhcmdlIiwiZmlyc3ROYW1lIjoiR2lsIiwibGFzdE5hbWUiOiJIb2ZmbWFuIiwic3BvcnRzIjpbXSwiaWQiOjYzNCwiaWF0IjoxNTAyMDA5MDU4LCJleHAiOjE1MDQ2Mzg4MDR9.kFLYkEA4JejVtzW5ZD_xIrVpByQjS88gjdYI4kdEDlk';
export const teamCreationJson={
	"address": {
		"city": "Tel Aviv-Yafo",
		"state": "Tel Aviv District",
		"lat": 32.0852999,
		"lon": 34.78176759999997
	},
	"levelOfPlay": [
		1
	],
	"minAge": 18,
	"maxAge": 99,
	"gender": 1,
	"allowNewMembers": true,
	"private": false,
	"membersCanInvite": true,
	"inviteOnly": false,
	"privacySetting": 1,
	"name": `test Team_${Number(new Date())}`,
	"sports": 2
}



export const params = {
	Login_username: "dima@roeto.co.il",
	Signup_username: "dima@roeto.co.il",
	Signup_Invalid_Email: "Dima.roeto.co.il",
	gilLoginEmail:'gil@reccenter.me',
	gilloginPass:'77474222',
	Login_password: "444422",
	FirstName: "TestFirst",
	CopmanyName:"Test Company",
	LastName: "TestLast",
	TeamName: 'Test Team @',
	SeasonName:'Test Season @',
	EventName: 'Test Event @ ',
	LeagueName:'Test League @ ',
	TourName: ' Test Tournament @',
	StartDate: new Date(),
	teamCreationAPI:{
		APIlink: APIroot + "/teams",
		requestBody: teamCreationJson,
		auth: AuthTokenUser1
	},
}

export function skipButton(){
	return element(by.css('.cta-button a')).click();
}




