import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {RootParamsList} from './AppConfig';

export function MainScreen({
  navigation,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  return <View style={{height: 100, width: 100, backgroundColor: 'red'}} />;
}
