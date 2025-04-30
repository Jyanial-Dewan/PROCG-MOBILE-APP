import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-image-fallback';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {ProcgURL} from '../../../App';
import {api} from '../../common/api/api';
import {useRootStore} from '../../stores/rootStore';
import {httpRequest} from '../../common/constant/httpRequest';
import MainHeader from '../../common/components/MainHeader';
import {COLORS} from '../../common/constant/Themes';
import {observer} from 'mobx-react-lite';
import {useToast} from '../../common/components/CustomToast';
import ContainerNew from '../../common/components/Container';
import CustomFlatList from '../../common/components/CustomFlatList';
import CustomTextNew from '../../common/components/CustomText';
import {formateDateTime} from '../../common/services/dateFormater';
import ReplyButton from '../../common/components/ReplyButton';
import Receivers from '../../common/components/Receivers';
import {useSocketContext} from '../../context/SocketContext';
import Autolink from 'react-native-autolink';
import {ActivityIndicator} from 'react-native-paper';

interface User {
  name: string;
  profile_picture: string;
}

const NotificationDetails = observer(() => {
  const isFocused = useIsFocused();
  const {userInfo, selectedUrl} = useRootStore();
  const {socket} = useSocketContext();
  const toaster = useToast();
  const route = useRoute();

  const {_id} = route.params as {_id: string};
  const navigation = useNavigation();
  const [totalMessages, setTotalMessages] = useState<any[]>([]);
  const [totalInvolvedUsers, setTotalInvolvedUsers] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recivers, setRecivers] = useState<User[]>([]);
  const [parrentMessage, setParrentMessage] = useState<any>();
  const {datePart, timePart} = formateDateTime(parrentMessage?.date);

  const url = selectedUrl || ProcgURL;
  const fallbacks = [require('../../assets/prifileImages/thumbnail.jpg')];

  // Fetch total Reply Messages
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const reply_params = {
        url: api.ReplyMessages + _id + `/${userInfo?.user_name}`,
        baseURL: ProcgURL,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(reply_params, setIsLoading);
      if (res) {
        setTotalMessages(res);
      }
    },
    [isFocused, _id],
  );

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

  const handleDeleteMessage = async (msgId: string) => {
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
          type: 'warning',
        });
        setTimeout(async () => {
          navigation.goBack();
        }, 1000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toaster.show({message: error.message, type: 'error'});
      }
    }
  };

  const handleReceivers = (id: string) => {
    setShowModal(true);
    const filterMessage = totalMessages.find(msg => msg.id === id);
    setRecivers(filterMessage.recivers.slice(1));
  };

  const renderItem = ({item}: any) => {
    const {datePart, timePart} = formateDateTime(item?.date);
    return (
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
            style={{
              height: 40,
              width: 40,
              objectFit: 'cover',
              borderRadius: 50,
            }}
            source={{
              uri: `${url}/${item.sender.profile_picture}`,
              headers: {
                Authorization: `Bearer ${userInfo?.access_token}`,
              },
            }}
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
                text={item?.sender.name}
              />
              <View style={{flexDirection: 'row', gap: 4}}>
                <CustomTextNew
                  txtSize={13}
                  txtColor={COLORS.inputTextColor}
                  txtWeight={'500'}
                  text={
                    'to ' +
                    (item.recivers.length > 1
                      ? `${item.recivers[0].name}`
                      : item.recivers[0].name)
                  }
                />
                {item.recivers.length > 1 && (
                  <TouchableOpacity onPress={() => handleReceivers(item.id)}>
                    <CustomTextNew
                      txtSize={14}
                      txtColor={COLORS.inputTextColor}
                      txtWeight={'500'}
                      text={'...'}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
          <Autolink
            text={item.body}
            style={styles.bodyText}
            mention="instagram"
            textProps={{selectionColor: 'blue'}}
          />
          {/* <CustomTextNew
            txtStyle={styles.bodyText}
            txtAlign="justify"
            text={item?.body}
          /> */}
          <View style={styles.itemListWrapper} />
        </View>
        <Receivers
          showModal={showModal}
          setShowModal={setShowModal}
          recivers={recivers}
        />
      </View>
    );
  };

  return (
    <ContainerNew
      style={styles.container}
      header={<MainHeader routeName={'Message_Details'} />}
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

          <CustomFlatList
            data={totalMessages}
            RenderItems={renderItem}
            isLoading={isLoading}
          />
          <ReplyButton parentId={_id} />
        </>
      )}
    </ContainerNew>
  );
});

export default NotificationDetails;

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
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
