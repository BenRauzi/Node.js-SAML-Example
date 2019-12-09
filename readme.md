# SAML Authentication Example

### Description:

This is an example of using SAML Authentication with Node.js using ```passport-saml```. This is a very brief configuration that is not set up to be immediately integrated with an app but serves as an example ofthe power that SAML authentication has when using an external IdP like Azure AD. I am a strong advocate for engineers to implement modern authentication protocols like this, OAuth and OpenID connect (and I plan to make example repositories for these as well) and think that security on the internet would be greatly increased if services moved their authentication to an external identity provider.

Note: Mail will not appear on AD users that don't have a registered mail app.

### Requirements:

- Must have Node.js installed on your host machine and have restarted afterwards

### Install Instructions:

- First save repository then ```cd``` into your directory (or open it in an IDE) and ```npm install```
- Then ```npm start```
- Navigate to ```https://localhost:3000/``` - Note: http:// will automatically redirect.
- Sign in.

#### Login Instructions:

Username: demo1@thinkitccs.onmicrosoft.com
Password: Jufo9290
