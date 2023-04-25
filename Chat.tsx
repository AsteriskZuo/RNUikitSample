import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {RootParamsList} from './AppConfig';

export function ChatScreen({
  navigation,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  return <View />;
}
