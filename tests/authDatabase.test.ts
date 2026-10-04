import assert from 'node:assert';
import test from 'node:test';
import { authDatabase } from '../src/services/authDatabase';

test('authDatabase: Sign Up creates a new persistent user and session', async () => {
  await authDatabase._resetAll();

  const result = await authDatabase.signUp({
    username: 'sami_pilot',
    displayName: 'সামিউল হক',
    password: 'star1234',
    cadetArchetype: 'pilot',
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.user);
  assert.strictEqual(result.user?.username, 'sami_pilot');
  assert.strictEqual(result.user?.displayName, 'সামিউল হক');
  assert.strictEqual(result.user?.isGuest, false);
  assert.strictEqual(result.user?.xp, 0);
  assert.strictEqual(result.user?.rank, 'Cadet');

  // Verify active session was set
  const session = await authDatabase.getCurrentSession();
  assert.ok(session);
  assert.strictEqual(session?.id, result.user?.id);
});

test('authDatabase: Duplicate username registration is rejected', async () => {
  const result = await authDatabase.signUp({
    username: 'SAMI_PILOT', // Case-insensitive duplicate test
    displayName: 'আরেকজন সামি',
    password: 'differentpass',
    cadetArchetype: 'engineer',
  });

  assert.strictEqual(result.success, false);
  assert.ok(result.error?.includes('ব্যবহৃত হয়েছে'));
});

test('authDatabase: Login with valid credentials succeeds and updates session', async () => {
  // Clear active session first
  await authDatabase.logout();
  let session = await authDatabase.getCurrentSession();
  assert.strictEqual(session, null);

  // Login
  const loginResult = await authDatabase.login('sami_pilot', 'star1234');
  assert.strictEqual(loginResult.success, true);
  assert.strictEqual(loginResult.user?.username, 'sami_pilot');

  session = await authDatabase.getCurrentSession();
  assert.strictEqual(session?.username, 'sami_pilot');
});

test('authDatabase: Login with wrong password or nonexistent username fails', async () => {
  const wrongPass = await authDatabase.login('sami_pilot', 'wrongpassword');
  assert.strictEqual(wrongPass.success, false);
  assert.ok(wrongPass.error?.includes('ভুল পাসওয়ার্ড'));

  const unknownUser = await authDatabase.login('nobody_exists', 'pass123');
  assert.strictEqual(unknownUser.success, false);
  assert.ok(unknownUser.error?.includes('পাওয়া যায়নি'));
});

test('authDatabase: Guest login creates guest account', async () => {
  const guest = await authDatabase.loginAsGuest({
    displayName: 'অতিথি রোভার',
    cadetArchetype: 'explorer',
  });

  assert.strictEqual(guest.isGuest, true);
  assert.strictEqual(guest.displayName, 'অতিথি রোভার');
  assert.strictEqual(guest.cadetArchetype, 'explorer');

  const session = await authDatabase.getCurrentSession();
  assert.strictEqual(session?.id, guest.id);
});

test('authDatabase: Progress update persists to storage', async () => {
  const session = await authDatabase.getCurrentSession();
  assert.ok(session);

  await authDatabase.updateProgress(session!.id, {
    xp: 150,
    completedLessonIds: ['lesson-1', 'lesson-2'],
  });

  const reloaded = await authDatabase.getUserById(session!.id);
  assert.strictEqual(reloaded?.xp, 150);
  assert.deepStrictEqual(reloaded?.completedLessonIds, ['lesson-1', 'lesson-2']);
});
