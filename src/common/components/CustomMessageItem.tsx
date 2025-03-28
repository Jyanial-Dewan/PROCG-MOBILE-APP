import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Row from './Row';
import {COLORS} from '../constant/Themes';
import Column from './Column';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextNew from './CustomText';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {formateDateTime} from '../services/dateFormater';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Swipeable} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {ProcgURL} from '../../../App';
import {useRootStore} from '../../stores/rootStore';

interface CustomMessageProps {
  from: string;
  item: any;
  notificationIds?: string[];
  selectedIds?: string[];
  handleLongPress: (id: string) => void;
  handlePress: (msgId: string, parentId: string) => Promise<void>;
  onDelete: (msgId: string) => Promise<void>;
}

const CustomMessageItem = ({
  item,
  from,
  notificationIds,
  selectedIds,
  handleLongPress,
  handlePress,
  onDelete,
}: CustomMessageProps) => {
  const {userInfo} = useRootStore();
  const {datePart, timePart} = formateDateTime(item.date);
  const progress = useSharedValue(1);
  const ref = useRef<Swipeable>(null);
  let closeTimeOut: NodeJS.Timeout | null = null;
  // Handle swipe open
  const handleSwipeOpen = () => {
    closeTimeOut = setTimeout(() => {
      ref.current?.close();
    }, 1000);
  };
  const rightSightAction = () => {
    return (
      <Animated.View
        style={[
          styles.rightAction,
          selectedIds?.includes(item.id)
            ? {backgroundColor: undefined}
            : undefined,
        ]}>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Feather name="trash" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={ref}
      renderRightActions={rightSightAction}
      onSwipeableOpen={handleSwipeOpen}>
      <Row
        rowStyle={[
          styles.rowStyle,
          {
            backgroundColor:
              notificationIds?.includes(item.id) ||
              selectedIds?.includes(item.id)
                ? COLORS.highLight
                : COLORS.green,
          },
        ]}
        rowWidth="100%"
        isPressOn={false}
        onCardLongPress={() => handleLongPress(item.id)}
        onCardPress={() => handlePress(item.id, item.parentid)}>
        <Column
          colStyle={[
            styles.colStyle,
            {
              borderColor: notificationIds?.includes(item.id)
                ? 'rgba(255, 26, 32, 0.3)'
                : COLORS.borderColor,
              backgroundColor: notificationIds?.includes(item.id)
                ? 'rgba(223, 255, 227,1)'
                : COLORS.white,
            },
          ]}>
          {selectedIds?.includes(item.id) ? (
            <Feather name="check" size={24} color={COLORS.green} />
          ) : (
            <>
              {from === 'Inbox' && (
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    objectFit: 'cover',
                    borderRadius: 50,
                  }}
                  source={{
                    uri: `${item.sender.profile_picture}`,
                    headers: {
                      Authorization: `Bearer ${userInfo?.access_token}`,
                    },
                  }}
                />
              )}
              {from === 'Sent' && (
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    objectFit: 'cover',
                    borderRadius: 50,
                  }}
                  source={{
                    uri: `${item.recivers[0].profile_picture}`,
                    headers: {
                      Authorization: `Bearer ${userInfo?.access_token}`,
                    },
                  }}
                />
              )}
              {from === 'Drafts' && (
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    objectFit: 'cover',
                    borderRadius: 50,
                  }}
                  source={{
                    uri: `${item.recivers[0].profile_picture}`,
                    headers: {
                      Authorization: `Bearer ${userInfo?.access_token}`,
                    },
                  }}
                />
              )}
              {from === 'RecycleBin' && (
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    objectFit: 'cover',
                    borderRadius: 50,
                  }}
                  source={{
                    uri: `${item.sender.profile_picture}`,
                    headers: {
                      Authorization: `Bearer ${userInfo?.access_token}`,
                    },
                  }}
                />
              )}
            </>
          )}
        </Column>
        <Column colStyle={{marginLeft: 10, backgroundColor: 'red'}}>
          <Row justify="space-between">
            <Row rowWidth="74%">
              <Column align="center">
                {(from === 'Inbox' || 'RecycleBin') && (
                  <CustomTextNew
                    txtStyle={styles.headText}
                    text={item.sender.name}
                  />
                )}
                {(from === 'Sent' || 'Drafts') && (
                  <CustomTextNew
                    txtStyle={styles.headText}
                    text={
                      item.recivers.length > 1
                        ? `${item.recivers[0].name} ...`
                        : item.recivers[0].name
                    }
                  />
                )}
              </Column>
            </Row>
            <Column align="center" colStyle={styles.dateStyle}>
              <Row>
                <CustomTextNew
                  txtStyle={[styles.dateText, {color: COLORS.black}]}
                  text={datePart}
                />
                <Text> </Text>
                <CustomTextNew txtStyle={styles.dateText} text={timePart} />
              </Row>
            </Column>
          </Row>
          <Row>
            <CustomTextNew
              txtStyle={styles.subjectText}
              txtAlign="justify"
              text={item?.subject}
            />
          </Row>
          <Row rowWidth="85%">
            <CustomTextNew
              txtStyle={styles.bodyText}
              txtAlign="justify"
              text={
                item?.body?.length > 200
                  ? item?.body?.slice(0, 200) + '...'
                  : item?.body
              }
            />
          </Row>
          <View style={styles.itemListWrapper} />
        </Column>
      </Row>
    </ReanimatedSwipeable>
  );
};

export default CustomMessageItem;

const styles = StyleSheet.create({
  rowStyle: {
    flex: 1,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  colStyle: {
    borderRadius: 50,
    borderWidth: 1,
  },
  dateStyle: {
    // backgroundColor: 'green',
  },
  headText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '400',
  },
  subjectText: {
    fontSize: 13,
    fontWeight: '500',
    marginVertical: 5,
  },
  bodyText: {
    fontSize: 12,
    fontWeight: '400',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    fontSize: 16,
  },
  rightAction: {
    width: 60,
    marginVertical: 5,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemListWrapper: {
    width: '83%',
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 8,
  },
});
