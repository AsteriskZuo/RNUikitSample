import {ChatLog} from 'react-native-chat-sdk';

export const RootParamsList: Record<string, object | undefined> = {
  Main: {},
  Chat: {},
};
export let appKey = '1135220126133718#demo';
export let defaultId = 'asterisk001';
export let defaultPs = 'qwerty';
export let accountType: 'agora' | 'easemob' | undefined;
export const autoLogin = false;
export const debugModel = true;
export let defaultTargetId = 'asterisk003';

try {
  appKey = require('./env').appKey;
  defaultId = require('./env').id;
  defaultPs = require('./env').ps;
  accountType = require('./env').accountType;
  defaultTargetId = require('./env').targetId;
} catch (error) {
  console.error(error);
}

export const dlog = new ChatLog();
dlog.tag = 'demo';
