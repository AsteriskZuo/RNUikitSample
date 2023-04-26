import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {
  RootParamsList,
  defaultId,
  defaultPs,
  defaultTargetId,
} from './AppConfig';
import {
  Button,
  ScreenContainer,
  TextInput,
  useChatSdkContext,
} from 'react-native-chat-uikit';

export function MainScreen({
  navigation,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  console.log('test:', defaultId, defaultPs);
  const placeholder1 = 'Please User Id';
  const placeholder2 = 'Please User Password or Token';
  const placeholder3 = 'Please Chat Target Id';
  const [id, setId] = React.useState(defaultId);
  const [token, setToken] = React.useState(defaultPs);
  const [chatId, setChatId] = React.useState(defaultTargetId);
  const {login: loginAction, logout: logoutAction} = useChatSdkContext();
  const login = () => {
    loginAction({
      id,
      pass: token,
      type: 'easemob',
      onResult: (result: {result: boolean; error?: any}) => {
        console.log('logout:', result.result, result.error);
      },
    });
  };
  const logout = () => {
    logoutAction({
      onResult: (result: {result: boolean; error?: any}) => {
        console.log('logout:', result.result, result.error);
      },
    });
  };
  const gotoChat = () => {
    if (chatId.length > 0) {
      navigation.push('Chat', {chatId: chatId, chatType: 0});
    }
  };
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder1}
            value={id}
            onChangeText={t => {
              setId(t);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder2}
            value={token}
            onChangeText={t => {
              setToken(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={login}>
            SIGN IN
          </Button>
          <Button style={styles.button} onPress={logout}>
            SIGN OUT
          </Button>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder3}
            value={chatId}
            onChangeText={t => {
              setChatId(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={gotoChat}>
            START CHAT
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    height: 40,
    marginHorizontal: 10,
  },
  inputContainer: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderBottomColor: '#0041FF',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});
