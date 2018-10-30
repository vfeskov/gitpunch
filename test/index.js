import * as dotenv from 'dotenv';
import { Selector, ClientFunction } from 'testcafe';
import { MongoClient } from 'mongodb';
import * as assert from 'assert';
dotenv.config();
const { SERVER_URL, MONGODB_URL, GITHUB_USERNAME, GITHUB_PASSWORD, GITHUB_EMAIL } = process.env

fixture `OAuth`
    .page `${SERVER_URL}`;

const getLocation = ClientFunction(() => document.location.href);

test('Sign In', async t => {
    await t
        .click(Selector('a').withText('Skip →'))
        .click('a[testid=github-sign-in]')
        .typeText('[name=login]', GITHUB_USERNAME)
        .typeText('[name=password]', GITHUB_PASSWORD)
        .click('[type=submit]')
    if (await Selector('button').withText('Authorize').exists) {
        await t.click(Selector('button:not([disabled])').withText('Authorize'))
    }
    await t
        .expect(getLocation()).contains(SERVER_URL)
        .expect(Selector('[testid=current-user-email]').innerText).eql(GITHUB_EMAIL);
    await queryDb(async db => {
        const user = await db.collection('users').findOne({ email: GITHUB_EMAIL })
        assert.equal(true, typeof user.accessToken === 'string' && !!user.accessToken)
    })
});

async function queryDb (callback) {
    const client = await MongoClient.connect(MONGODB_URL)
    await callback(client.db())
    client.close()
}
