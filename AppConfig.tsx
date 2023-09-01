import {ChatLog} from 'react-native-chat-sdk';

export const RootParamsList: Record<string, object | undefined> = {
  Main: {},
  Chat: {},
};
export let appKey = '41117440#383391';
export let defaultId = 'asterisk030';
export let defaultPs = '1';
export const autoLogin = false;
export const debugModel = true;
export let defaultTargetId = 'asterisk003';

try {
  appKey = require('./env').appKey;
  defaultId = require('./env').id;
  defaultPs = require('./env').ps;
  defaultTargetId = require('./env').targetId;
} catch (error) {
  console.error(error);
}

export const dlog = new ChatLog();
dlog.tag = 'demo';
