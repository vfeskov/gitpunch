import * as dotenv from 'dotenv';
import { Selector, ClientFunction } from 'testcafe';
import { MongoClient } from 'mongodb';
dotenv.config();
const { SERVER_URL, MONGODB_URL, GITHUB_USERNAME, GITHUB_PASSWORD, GITHUB_EMAIL } = process.env

export const getLocation = ClientFunction(() => document.location.href);

export async function queryDb (callback) {
  const client = await MongoClient.connect(MONGODB_URL, { useNewUrlParser: true });
  // force staging db to prevent accidentally running tests on production
  await callback(client.db('staging'));
  client.close();
}

export function skipIntro (t) {
  return t.click(Selector('a').withText('Skip →'));
}

export async function doGitHubSignIn (t) {
  await t
    .click('a[testid=github-sign-in]')
    .typeText('[name=login]', GITHUB_USERNAME)
    .typeText('[name=password]', GITHUB_PASSWORD)
    .click('[type=submit]');
  if (await Selector('button').withText('Authorize').exists) {
    await t.click(Selector('button:not([disabled])').withText('Authorize'));
  }
  await t
    .expect(getLocation()).contains(SERVER_URL)
    .expect(Selector('[testid=current-user-email]').innerText).eql(GITHUB_EMAIL);
}
