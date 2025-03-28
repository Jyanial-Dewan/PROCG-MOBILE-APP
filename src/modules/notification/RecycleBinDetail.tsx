import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {COLORS} from '../../common/constant/Themes';
import {ActivityIndicator} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {api} from '../../common/api/api';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import {useRootStore} from '../../stores/rootStore';
import {useToast} from '../../common/components/CustomToast';
import {observer} from 'mobx-react-lite';
import CustomTextNew from '../../common/components/CustomText';
import {formateDateTime} from '../../common/services/dateFormater';
import Image from 'react-native-image-fallback';
import {useSocketContext} from '../../context/SocketContext';

const RecycleBinDetail = observer(() => {
  const isFocused = useIsFocused();
  const {userInfo, selectedUrl} = useRootStore();
  const {socket} = useSocketContext();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [parrentMessage, setParrentMessage] = useState<any>({
    id: '',
    sender: '',
    recivers: [],
    subject: '',
    body: '',
    date: new Date(),
    status: '',
    parentid: '',
    involvedusers: [],
    readers: [],
    holders: [],
    recyclebin: [],
  });
  const [totalInvolvedUsers, setTotalInvolvedUsers] = useState<string[]>([]);
  const route = useRoute();
  const toaster = useToast();
  const routeName = route.name;
  const {_id} = route.params as {_id: string};
  const {datePart, timePart} = formateDateTime(parrentMessage?.date);
  const url = selectedUrl || ProcgURL;
  const fallbacks = [require('../../assets/prifileImages/thumbnail.jpg')];
  //Fetch SingleMessage
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: api.Messages + '/' + _id,
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        setParrentMessage(res);
        setTotalInvolvedUsers(res.involvedusers);
      }
    },
    [isFocused, _id],
  );

  const handleDeleteFromRecycleBin = async (msg: any) => {
    const putParams = {
      url: api.DeleteFromRecycle + msg.id + `/${userInfo?.user_name}`,
      method: 'put',
      baseURL: url,
      isConsole: true,
      isConsoleParams: true,
    };
    const deleteParams = {
      url: api.Messages + '/' + msg.id,
      method: 'delete',
      baseURL: url,
      isConsole: true,
      isConsoleParams: true,
    };
    try {
      const holdersNumber = msg.holders?.length ?? 0;
      const recycleBinNumber = msg.recyclebin?.length ?? 0;
      if (holdersNumber > 0) {
        const response = await httpRequest(putParams, setIsLoading);
        if (response) {
          socket?.emit('deleteMessage', {
            id: msg.id,
            user: userInfo?.user_name,
          });
          toaster.show({
            message: 'Message has been deleted.',
            type: 'success',
          });
          setTimeout(async () => {
            navigation.goBack();
          }, 500);
        }
      } else {
        if (recycleBinNumber > 1) {
          const response = await httpRequest(putParams, setIsLoading);
          if (response) {
            socket?.emit('deleteMessage', {
              id: msg.id,
              user: userInfo?.user_name,
            });
            toaster.show({
              message: 'Message has been deleted.',
              type: 'success',
            });
            setTimeout(async () => {
              navigation.goBack();
            }, 500);
          }
        } else if (recycleBinNumber === 1) {
          const response = await httpRequest(deleteParams, setIsLoading);
          if (response) {
            socket?.emit('deleteMessage', {
              id: msg.id,
              user: userInfo?.user_name,
            });
            toaster.show({
              message: 'Message has been deleted.',
              type: 'success',
            });
            setTimeout(async () => {
              navigation.goBack();
            }, 500);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toaster.show({message: error.message, type: 'error'});
      }
    }
  };

  //   const handleDelete = async (msg: Message) => {
  //     try {
  //       const holdersNumber = msg.holders?.length ?? 0;
  //       const recycleBinNumber = msg.recyclebin?.length ?? 0;
  //       if (holdersNumber > 0) {
  //         const response = await api.put(
  //           `/messages/remove-user-from-recyclebin/${msg.id}/${user}`,
  //         );
  //         if (response.status === 200) {
  //           handleDeleteMessage(msg.id);
  //           toast({
  //             title: 'Message has been deleted.',
  //           });
  //         }
  //       } else {
  //         if (recycleBinNumber > 1) {
  //           const response = await api.put(
  //             `/messages/remove-user-from-recyclebin/${msg.id}/${user}`,
  //           );
  //           if (response.status === 200) {
  //             handleDeleteMessage(msg.id);
  //             toast({
  //               title: 'Message has been deleted.',
  //             });
  //           }
  //         } else if (recycleBinNumber === 1) {
  //           const response = await api.delete(`/messages/${msg.id}`);
  //           if (response.status === 200) {
  //             handleDeleteMessage(msg.id);
  //             toast({
  //               title: 'Message has been deleted.',
  //             });
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log('Error deleting message.');
  //     }
  //   };

  return (
    <ContainerNew
      style={styles.container}
      header={<MainHeader routeName={routeName} />}
      isScrollView={false}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <CustomTextNew
            text={parrentMessage?.subject}
            txtColor={COLORS.black}
            txtSize={14}
            txtWeight={'600'}
            lineHight={16}
          />
          <View style={styles.itemListWrapper} />
          <View style={[styles.rowContainer]}>
            {/* Image Section */}
            <View
              style={[
                styles.imageStyle,
                {
                  borderColor: COLORS.notifcationIconBorder,
                  backgroundColor: COLORS.white,
                },
              ]}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: `${url}/${parrentMessage.sender.profile_picture}`,
                  headers: {
                    Authorization: `Bearer ${userInfo?.access_token}`,
                  },
                }}
                fallback={fallbacks}
              />
            </View>

            {/* Sender, date, receivers Section */}
            <View
              style={{
                flex: 1,
                marginLeft: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <CustomTextNew
                    txtStyle={styles.headText}
                    text={parrentMessage?.sender.name}
                  />
                  <CustomTextNew
                    txtSize={13}
                    txtColor={COLORS.inputTextColor}
                    txtWeight={'500'}
                    text={
                      'to ' +
                      (parrentMessage?.recivers.length > 1
                        ? `${parrentMessage?.recivers[0]?.name} ...`
                        : parrentMessage?.recivers[0]?.name)
                    }
                  />
                </View>
                <View style={{flexDirection: 'row', gap: 5}}>
                  <CustomTextNew
                    txtStyle={[styles.dateText, {color: COLORS.black}]}
                    text={datePart}
                  />
                  <CustomTextNew txtStyle={styles.dateText} text={timePart} />
                </View>
              </View>
              {/* Body Section */}
              <CustomTextNew
                txtStyle={styles.bodyText}
                txtAlign="justify"
                text={parrentMessage?.body}
              />
              <View style={styles.itemListWrapper} />
            </View>
          </View>
        </>
      )}
    </ContainerNew>
  );
});

export default RecycleBinDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  imageStyle: {
    borderRadius: 50,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  bodyText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.black,
    letterSpacing: 0.7,
  },
  msgText: {
    fontSize: 13,
    fontWeight: '400',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '400',
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 14,
  },
  profileImage: {
    height: 40,
    width: 40,
    objectFit: 'cover',
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
