import * as dotenv from 'dotenv';
import { Selector, ClientFunction } from 'testcafe'; // first import testcafe selectors
dotenv.config();

fixture `OAuth`
    .page `http://localhost:3000/`;  // specify the start page

const getLocation = ClientFunction(() => document.location.href);

test('Sign In', async t => {
    await t
        .click(Selector('a').withText('Skip →'))
        .click('a[testid=github-sign-in]')
        .typeText('[name=login]', process.env.GITHUB_USERNAME)
        .typeText('[name=password]', process.env.GITHUB_PASSWORD)
        .click('[type=submit]')
    if (await Selector('button').withText('Authorize').exists) {
        await t.click(Selector('button:not([disabled])').withText('Authorize'))
    }
    await t
        .expect(getLocation()).contains('http://localhost:3000/')
        .expect(Selector('[testid=current-user-email]').innerText).eql(process.env.GITHUB_EMAIL);
});
