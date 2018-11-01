import { Selector } from 'testcafe';
import * as assert from 'assert';
import { queryDb, doGitHubSignIn, skipIntro } from './lib';
const { SERVER_URL, GITHUB_EMAIL } = process.env;

fixture `GitHub Sign In`
  .page(SERVER_URL)
  .beforeEach(() =>
    queryDb(async db => db.collection('users').remove({}))
  );

test('Basic use case', async t => {
  await skipIntro(t)
  await doGitHubSignIn(t)
  await queryDb(async db => {
    const user = await db.collection('users').findOne({ email: GITHUB_EMAIL });
    assert.equal(true, typeof user.accessToken === 'string' && !!user.accessToken);
  });
});

test('First add repos then sign in', async t => {
  await skipIntro(t);
  await t
    .typeText('[testid=repo-add-input]:not([disabled])', 'facebook/react')
    .click('button[testid=repo-add-submit]')
    .click(Selector('.rc-slider').find('span').withText('Minor'))

    .typeText('[testid=repo-add-input]:not([disabled])', 'angular/angular')
    .pressKey('enter')
    .click('button[testid=mute-repo]')
    .click(Selector('.rc-slider').find('span').withText('Patch'))

    .typeText('[testid=repo-add-input]:not([disabled])', 'vuejs/vue')
    .pressKey('enter')

    .typeText('[testid=repo-add-input]:not([disabled])', 'emberjs/ember.js')
    .click('button[testid=repo-add-submit]')

    .click(Selector('[testid=repo-name]').withText('vuejs/vue'))
    .click(Selector('.rc-slider').find('span').withText('Major'))

    .typeText('[testid=repo-add-input]:not([disabled])', 'nonexistent/repo')
    .click('button[testid=repo-add-submit]');

  await doGitHubSignIn(t);

  await queryDb(async db => {
    const user = await db.collection('users').findOne({ email: GITHUB_EMAIL });
    assert.equal(true, typeof user.accessToken === 'string' && !!user.accessToken);
    assert.deepStrictEqual(['facebook/react', 'angular/angular', 'vuejs/vue', 'emberjs/ember.js'], user.repos);
    assert.deepStrictEqual(['angular/angular'], user.mutedRepos);
    assert.deepStrictEqual(['vuejs/vue'], user.majors);
    assert.deepStrictEqual(['facebook/react'], user.minors);
    assert.deepStrictEqual(['angular/angular'], user.patches);
  });
});


