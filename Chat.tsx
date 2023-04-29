import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamsList, dlog} from './AppConfig';
import {
  Button,
  ChatFragment,
  ChatFragmentRef,
  ScreenContainer,
  Services,
  getFileExtension,
  uuid,
} from 'react-native-chat-uikit';
import {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {
  GestureResponderEvent,
  GestureResponderHandlers,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

export function ChatScreen({
  route,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  dlog.log('test:', route.params);
  const chatRef = React.useRef<ChatFragmentRef>({} as any);
  const chatId = React.useRef((route.params as any).chatId ?? '').current;
  // const chatType = (route.params as any).chatType ?? 0;
  const [showSheet, setShowSheet] = React.useState(false);

  const onPressInInputVoiceButton = () => {
    Services.ms
      .startRecordAudio({
        audio: {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVModeIOS: AVModeIOSOption.measurement,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        } as AudioSet,
        onPosition: pos => {
          dlog.log('test:startRecordAudio:pos:', pos);
        },
        onFailed: error => {
          console.warn('test:startRecordAudio:onFailed:', error);
        },
        onFinished: ({result, path, error}) => {
          dlog.log('test:startRecordAudio:onFinished:', result, path, error);
        },
      })
      .then(result => {
        dlog.log('test:startRecordAudio:result:', result);
      })
      .catch(error => {
        console.warn('test:startRecordAudio:error:', error);
      });
  };
  const onPressOutInputVoiceButton = () => {
    dlog.log('test:onPressOutInputVoiceButton:', Services.dcs);
    let localPath = Services.dcs.getFileDir(chatId, uuid());
    Services.ms
      .stopRecordAudio()
      .then((result?: {pos: number; path: string}) => {
        if (result?.path) {
          const extension = getFileExtension(result.path);
          localPath = localPath + extension;
          Services.ms
            .saveFromLocal({
              targetPath: localPath,
              localPath: result.path,
            })
            .then(() => {
              onVoiceRecordEnd?.({
                localPath,
                duration: result.pos / 1000,
              });
            })
            .catch(error => {
              console.warn('test:startRecordAudio:save:error', error);
            });
        }
      })
      .catch(error => {
        console.warn('test:stopRecordAudio:error:', error);
      });
  };
  const onVoiceRecordEnd = (params: {localPath: string; duration: number}) => {
    chatRef.current.sendVoiceMessage(params);
  };

  const More = () => {
    if (showSheet === false) {
      return null;
    }

    const handlers1 = {
      onStartShouldSetResponder: (_: GestureResponderEvent): boolean => {
        return true;
      },
      onStartShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
        return false;
      },
      onResponderGrant: (_: GestureResponderEvent) => {},
      onResponderRelease: (_: GestureResponderEvent) => {
        dlog.log('test:onResponderRelease:1:');
        setShowSheet(false);
      },
    } as GestureResponderHandlers;
    const handlers2 = {
      onStartShouldSetResponder: (_: GestureResponderEvent): boolean => {
        return true;
      },
      onStartShouldSetResponderCapture: (_: GestureResponderEvent): boolean => {
        return false;
      },
      onResponderGrant: (_: GestureResponderEvent) => {},
      onResponderRelease: (_: GestureResponderEvent) => {
        dlog.log('test:onResponderRelease:2:');
      },
    } as GestureResponderHandlers;

    const onCamera = () => {
      setShowSheet(false);
      Services.ms
        .openCamera({})
        .then(result => {
          dlog.log('openCamera:', Platform.OS, result);
          chatRef.current?.sendImageMessage([
            {
              name: result?.name ?? '',
              localPath: result?.uri ?? '',
              fileSize: result?.size ?? 0,
              imageType: result?.type ?? '',
              width: result?.width ?? 0,
              height: result?.height ?? 0,
              onResult: r => {
                dlog.log('openCamera:result:', r);
              },
            },
          ]);
        })
        .catch(error => {
          console.warn('error:', error);
        });
    };
    const onAlbum = () => {
      setShowSheet(false);
      Services.ms
        .openMediaLibrary({selectionLimit: 1})
        .then(result => {
          dlog.log('openMediaLibrary:', Platform.OS, result);
          chatRef.current?.sendImageMessage(
            result.map(value => {
              return {
                name: value?.name ?? '',
                localPath: value?.uri ?? '',
                fileSize: value?.size ?? 0,
                imageType: value?.type ?? '',
                width: value?.width ?? 0,
                height: value?.height ?? 0,
                onResult: r => {
                  dlog.log('openMediaLibrary:result:', r);
                },
              };
            }),
          );
        })
        .catch(error => {
          console.warn('error:', error);
        });
    };
    const onFiles = async () => {
      setShowSheet(false);
      const ret = await Services.ps.hasMediaLibraryPermission();
      if (ret === false) {
        await Services.ps.requestMediaLibraryPermission();
      }
      Services.ms
        .openDocument({})
        .then(result => {
          dlog.log('openDocument:', Platform.OS, result);
          chatRef.current?.sendFileMessage({
            localPath: result?.uri ?? '',
            fileSize: result?.size ?? 0,
            displayName: result?.name,
            onResult: r => {
              dlog.log('openDocument:result', r);
            },
          });
        })
        .catch(error => {
          console.warn('error:', error);
        });
    };

    return (
      <View style={[styles.moreContainer]} {...handlers1}>
        <View style={styles.contentContainer} {...handlers2}>
          <Button style={styles.button} onPress={onCamera}>
            Camera
          </Button>
          <Button style={styles.button} onPress={onAlbum}>
            Album
          </Button>
          <Button style={styles.button} onPress={onFiles as any}>
            Files
          </Button>
        </View>
      </View>
    );
  };

  const ChatFragmentMemo = React.memo(ChatFragment);
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragmentMemo
        propsRef={chatRef}
        screenParams={{
          params: route.params as any,
        }}
        onPressInInputVoiceButton={onPressInInputVoiceButton}
        onPressOutInputVoiceButton={onPressOutInputVoiceButton}
        onVoiceRecordEnd={onVoiceRecordEnd}
        onClickInputMoreButton={() => {
          setShowSheet(true);
        }}
      />
      <More />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  moreContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    height: 200,
  },
  button: {
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
  },
});
