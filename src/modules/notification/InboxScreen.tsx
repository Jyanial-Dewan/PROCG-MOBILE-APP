import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import ContainerNew from '../../common/components/Container';
import CustomTextNew from '../../common/components/CustomText';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../stores/rootStore';
import {COLORS} from '../../common/constant/Themes';
import CustomFlatList from '../../common/components/CustomFlatList';
import MainHeader from '../../common/components/MainHeader';
import {_todayDate} from '../../common/services/todayDate';
import {api} from '../../common/api/api';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import Feather from 'react-native-vector-icons/Feather';
import CustomDropDownNew from '../../common/components/CustomDropDownTwo';
import {useForm} from 'react-hook-form';
import {observer} from 'mobx-react-lite';
import {NotificationDetailsNavigationProp} from '../../navigations/NotificationStack';
import LongPressedHeader from '../../common/components/LongPressedHeader';
import {useToast} from '../../common/components/CustomToast';
import PlusButton from '../../common/components/PlusButton';
import {formateDateTime} from '../../common/services/dateFormater';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Image from 'react-native-image-fallback';
import {useSocketContext} from '../../context/SocketContext';

export interface RenderMessageItemProps {
  item: any;
  userInfo: any;
  selectedIds: string[];
  notificationIds?: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleLongPress: (id: string) => void;
  handlePress: (msgId: string, parentId: string) => Promise<void>;
  setIsLongPressed: React.Dispatch<React.SetStateAction<boolean>>;
  handleSingleDeleteMessage: (msg: any) => Promise<void>;
}

const ITEMHEIGHT = 83.5;
const RenderMessageItem = observer(
  ({
    item,
    userInfo,
    selectedIds,
    notificationIds,
    setSelectedIds,
    setIsLongPressed,
    handleLongPress,
    handlePress,
    handleSingleDeleteMessage,
  }: RenderMessageItemProps) => {
    const screenWidth = useWindowDimensions().width;
    const SWIPE_THRESHOLD = -screenWidth * 0.6;
    const translateX = useSharedValue(0);
    const marginY = useSharedValue(5);
    const scaleX = useSharedValue(0);
    const hasExecuted = useRef(false);
    const [loaded, setLoaded] = useState(false);
    const {datePart, timePart} = formateDateTime(item.date);
    const {selectedUrl} = useRootStore();

    const url = selectedUrl || ProcgURL;
    const fallbacks = [require('../../assets/prifileImages/thumbnail.jpg')];
    const handleDelete = () => {
      handleSingleDeleteMessage(item.id);
    };
    const panGesture = Gesture.Pan()
      .failOffsetY([-5, 5])
      .activeOffsetX([-5, 5])
      .onUpdate(event => {
        // Update the position of the component based on the gesture
        translateX.value = event.translationX;
        if (selectedIds.length > 0 && !hasExecuted.current) {
          runOnJS(setSelectedIds)([]);
          runOnJS(setIsLongPressed)(false);
          hasExecuted.current = true;
        }
      })
      .onEnd(() => {
        console.log(scaleX.value);
        if (selectedIds.length > 0 && !hasExecuted.current) {
          runOnJS(setSelectedIds)([]);
          runOnJS(setIsLongPressed)(false);
          hasExecuted.current = false;
        }
        // Determine if the component should be dismissed or return to its original position
        const shouldDelete = translateX.value < SWIPE_THRESHOLD;

        if (shouldDelete) {
          // runOnJS(handleDelete)();
          translateX.value = withTiming(-screenWidth, {}, finished => {
            if (finished) {
              runOnJS(handleDelete)();
              marginY.value = withTiming(0);
              scaleX.value = withTiming(0);
            }
          });
        } else {
          translateX.value = withSpring(0, {
            duration: 1,
          });
        }
      });
    const animatedStyle = useAnimatedStyle(() => {
      // console.log(translateX.value, 'value');
      return {
        transform: [
          {
            translateX: translateX.value,
          },
        ],
      };
    });

    const height = useAnimatedStyle(() => {
      return {
        height: scaleX.value,
        marginVertical: marginY.value,
      };
    });
    const animatedHeight = !loaded ? {} : height;

    const backgroundColor = selectedIds.includes(item.id)
      ? 'transparent'
      : COLORS.primary;

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[animatedHeight, {backgroundColor}]}
          onLayout={e => {
            if (!loaded) {
              scaleX.value = ITEMHEIGHT;
              setLoaded(true);
            }
          }}>
          <View style={styles.deleteBtn}>
            <Feather name="trash" size={24} color={COLORS.white} />
          </View>

          <Animated.View
            style={[animatedStyle, {backgroundColor: COLORS.white}]}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.rowContainer,
                {
                  backgroundColor:
                    notificationIds?.includes(item.id) ||
                    selectedIds.includes(item?.id)
                      ? COLORS.highLight
                      : COLORS.white,
                },
              ]}
              onLongPress={() => handleLongPress(item?.id)}
              onPress={() => handlePress(item?.id, item?.parentid)}>
              {/* Image Section */}
              <View
                style={[
                  styles.imageStyle,
                  {
                    borderColor: COLORS.notifcationIconBorder,
                    backgroundColor: COLORS.white,
                  },
                ]}>
                {selectedIds.includes(item.id) ? (
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="check" size={24} color={COLORS.green} />
                  </View>
                ) : (
                  <Image
                    style={styles.profileImage}
                    source={{
                      uri: `${url}/${item.sender.profile_picture}`,
                      headers: {
                        Authorization: `Bearer ${userInfo?.access_token}`,
                      },
                    }}
                    fallback={fallbacks}
                  />
                )}
              </View>

              {/* Text Section */}
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
                  <CustomTextNew
                    txtStyle={styles.headText}
                    text={item?.sender.name}
                  />
                  <View style={{flexDirection: 'row', gap: 5}}>
                    <CustomTextNew
                      txtStyle={[styles.dateText, {color: COLORS.black}]}
                      text={datePart}
                    />
                    <CustomTextNew txtStyle={styles.dateText} text={timePart} />
                  </View>
                </View>
                <CustomTextNew
                  txtStyle={styles.msgText}
                  txtAlign="justify"
                  text={item?.subject}
                />
                <CustomTextNew
                  txtStyle={styles.bodyText}
                  txtAlign="justify"
                  text={
                    item?.body?.length > 60
                      ? item?.body?.replace(/\s+/g, ' ').slice(0, 60) + '...'
                      : item?.body?.replace(/\s+/g, ' ')
                  }
                />
                <View style={styles.itemListWrapper} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const InboxScreen = observer(() => {
  const isFocused = useIsFocused();
  const {userInfo, messageStore, selectedUrl} = useRootStore();
  const {socket} = useSocketContext();
  const navigation = useNavigation<NotificationDetailsNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(0);
  const notificationIds = messageStore.notificationMessages.map(msg => msg.id);
  const route = useRoute();
  const toaster = useToast();
  const url = selectedUrl || ProcgURL;
  const {control, setValue} = useForm({
    defaultValues: {
      routeName: {label: route.name},
    },
  });

  useFocusEffect(
    useCallback(() => {
      setValue('routeName', {label: route.name});
    }, [isFocused]),
  );
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsLoading(true);
      const api_params = {
        url: api.ReceivedMessages + userInfo?.user_name + `/${currentPage}`,
        baseURL: url,
        isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        setHasMore(res.length);
        messageStore.setRefreshing(false);
        const formattedRes = res.map((msg: any) => ({
          ...msg,
          date: new Date(msg.date),
        }));
        messageStore.saveReceivedMessages(formattedRes);
      }

      if (res.length < 5) {
        return;
      }
    },
    [
      isFocused,
      currentPage,
      messageStore.receivedMessages.length,
      messageStore.refreshing,
    ],
  );

  const handleRefresh = () => {
    messageStore.setRefreshing(true);
    setCurrentPage(1);
  };

  // read Message
  const handlePress = async (msgId: string, parentId: string) => {
    if (isLongPressed) {
      setSelectedIds(prev => [msgId, ...prev]);
    } else {
      const readerParams = {
        url: api.UpdateReaders + parentId + `/${userInfo?.user_name}`,
        method: 'put',
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      try {
        const response = await httpRequest(readerParams, setIsLoading);
        if (response) {
          if (notificationIds.includes(parentId)) {
            socket?.emit('read', {id: parentId, user: userInfo?.user_name});
          }
          navigation.navigate('NotificationDetails', {
            _id: parentId,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
    if (selectedIds.includes(msgId)) {
      handleDisSelect(msgId);
    }
  };

  const handleLongPress = (id: string) => {
    setIsLongPressed(true);
    setSelectedIds(prev => [id, ...prev]);
  };

  const handleDisSelect = (id: string) => {
    const newSelected = selectedIds.filter(item => item !== id);
    setSelectedIds(newSelected);
  };

  const handleCancelLongPress = () => {
    setIsLongPressed(false);
    setSelectedIds([]);
  };

  const handleSingleDeleteMessage = async (msgId: string) => {
    const deleteParams = {
      url: api.DeleteMessage + msgId + `/${userInfo?.user_name}`,
      method: 'put',
      baseURL: url,
      isConsole: true,
      isConsoleParams: true,
    };

    try {
      setIsLoading(true);
      const response = await httpRequest(deleteParams, setIsLoading);
      if (response) {
        socket?.emit('deleteMessage', {id: msgId, user: userInfo?.user_name});
        toaster.show({
          message: 'Message has been moved to recyclebin.',
          type: 'success',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toaster.show({message: error.message, type: 'error'});
      }
    }
  };

  const handleMultipleDelete = async () => {
    const params = {
      url: api.MoveMultipleToRecycleBin + userInfo?.user_name,
      data: {ids: selectedIds},
      method: 'put',
      baseURL: url,
      // isConsole: true,
      // isConsoleParams: true,
    };
    try {
      const response = await httpRequest(params, setIsLoading);
      if (response) {
        socket?.emit('multipleDelete', {
          ids: selectedIds,
          user: userInfo?.user_name,
        });
        toaster.show({
          message: 'Message has been moved to recyclebin.',
          type: 'success',
        });
        setIsLongPressed(false);
        setSelectedIds([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const MessageGroups = () => {
    return (
      <CustomDropDownNew
        name="routeName"
        setValue={setValue}
        control={control}
        labelStyle={styles.label}
        isIconShow={true}
      />
    );
  };

  const EmptyListItem = () => {
    return (
      <View style={styles.emptyListStyle}>
        <CustomTextNew text={'No message found'} txtColor={COLORS.black} />
      </View>
    );
  };

  return (
    <ContainerNew
      isScrollView={false}
      header={
        isLongPressed ? (
          <LongPressedHeader
            handleCancelLongPress={handleCancelLongPress}
            handleMultipleDelete={handleMultipleDelete}
          />
        ) : (
          <MainHeader routeName="Inbox" style={{fontWeight: '700'}} />
        )
      }
      footer={<PlusButton />}
      style={styles.container}>
      <MessageGroups />
      <CustomFlatList
        key={messageStore.receivedMessages.length}
        data={messageStore.receivedMessages}
        RenderItems={({item}: any) => (
          <RenderMessageItem
            item={item}
            userInfo={userInfo}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            notificationIds={notificationIds}
            setIsLongPressed={setIsLongPressed}
            handleLongPress={handleLongPress}
            handlePress={handlePress}
            handleSingleDeleteMessage={handleSingleDeleteMessage}
          />
        )}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasMore={hasMore}
        contentContainerStyle={
          messageStore.sentMessages.length === 0 ? styles.flexGrow : null
        }
        emptyItem={EmptyListItem}
        refreshing={messageStore.refreshing}
        onRefresh={handleRefresh}
      />
    </ContainerNew>
  );
});

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 5,
    minHeight: 83.5,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
  },

  imageStyle: {
    borderRadius: 50,
    borderWidth: 1,
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  bodyText: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.darkGray,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '400',
  },
  msgText: {
    fontSize: 13,
    fontWeight: '400',
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  stsTxt: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    color: COLORS.green,
  },

  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 8,
  },
  deleteBtn: {
    position: 'absolute',
    right: '5%',
    top: '30%',
  },
  profileImage: {
    height: 40,
    width: 40,
    objectFit: 'cover',
    borderRadius: 50,
  },
  emptyListStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },
});
