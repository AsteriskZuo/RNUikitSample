export const RootParamsList: Record<string, object | undefined> = {
  Main: {},
  Chat: {},
};
export let appKey = '1135220126133718#demo';
export let defaultId = 'asterisk001';
export let defaultPs = 'qwerty';
export const autoLogin = false;
export const debugModel = true;

try {
  appKey = require('./env').appKey;
  defaultId = require('./env').id;
  defaultPs = require('./env').ps;
} catch (error) {
  console.error(error);
}
