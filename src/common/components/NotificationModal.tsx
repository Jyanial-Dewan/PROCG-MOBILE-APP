import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {v4 as uuidv4} from 'uuid';
import {api} from '../api/api';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../constant/httpRequest';
import {useIsFocused} from '@react-navigation/native';
import {useRootStore} from '../../stores/rootStore';
import {COLORS} from '../constant/Themes';
import {useToast} from './CustomToast';
import {useSocketContext} from '../../context/SocketContext';

const NotificationModal = () => {
  const {usersStore, userInfo} = useRootStore();
  const {socket} = useSocketContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [recivers, setRecivers] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sender = userInfo?.user_name;
  const id = uuidv4();
  const toaster = useToast();

  const totalusers = [...recivers, userInfo?.user_name];
  const uniqueUsers = [...new Set(totalusers)];
  const actualUsers = usersStore.users.filter(
    usr => usr.user_name !== userInfo?.user_name,
  );

  const filterdUser = actualUsers.filter(user =>
    user.user_name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleReciever = (reciever: string) => {
    if (recivers.includes(reciever)) {
      const newArray = recivers.filter(rcvr => rcvr !== reciever);
      setRecivers(newArray);
    } else {
      setRecivers(prevArray => [...prevArray, reciever]);
    }
  };

  const handleSelectAll = () => {
    if (!isAllClicked) {
      setIsAllClicked(true);
      setRecivers(actualUsers.map(user => user.user_name));
    } else {
      setIsAllClicked(false);
      setRecivers([]);
    }
  };

  const handleSend = async () => {
    const sendPayload = {
      id,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: 'Sent',
      parentid: id,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: uniqueUsers,
      recyclebin: [],
    };
    const sendParams = {
      url: api.Messages,
      data: sendPayload,
      method: 'post',
      baseURL: ProcgURL,
      // isConsole: true,
      // isConsoleParams: true,
    };
    try {
      setIsSending(true);
      const response = await httpRequest(sendParams, setIsLoading);
      if (response) {
        socket?.emit('sendMessage', sendPayload);
        toaster.show({message: 'Message Sent Successfully', type: 'success'});
      }
    } catch (error) {
      if (error instanceof Error) {
        toaster.show({message: error.message, type: 'error'});
      }
    } finally {
      setIsSending(false);
      setRecivers([]);
      setSubject('');
      setBody('');
    }
    console.log('Send Success Notification Modal');
  };
  // draft
  const handleDraft = async () => {
    const draftPayload = {
      id,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: 'Draft',
      parentid: id,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: uniqueUsers,
      recyclebin: [],
    };
    const draftParams = {
      url: api.Messages,
      data: draftPayload,
      method: 'post',
      baseURL: ProcgURL,
      // isConsole: true,
      // isConsoleParams: true,
    };
    try {
      setIsSending(true);
      const response = await httpRequest(draftParams, setIsLoading);
      if (response) {
        socket?.emit('sendDraft', draftPayload);
        toaster.show({
          message: 'Message Send to Draft Successfully',
          type: 'success',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toaster.show({message: error.message, type: 'error'});
      }
    } finally {
      setIsSending(false);
      setRecivers([]);
      setSubject('');
      setBody('');
    }
  };

  return (
    <View style={styles.centeredView}>
      {isSending || isDrafting ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : null}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => setShowUsers(false)}>
            <View style={styles.modalView}>
              <View style={{width: '100%', alignItems: 'flex-end'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name="close" size={24} color="black" />
                </Pressable>
              </View>

              <View
                style={{width: '100%', marginBottom: 16, position: 'relative'}}>
                <Pressable
                  style={styles.selectButton}
                  onPress={() => setShowUsers(prev => !prev)}>
                  <Text
                    style={{fontSize: 18, fontWeight: '600', color: 'white'}}>
                    Select Recipients
                  </Text>
                </Pressable>
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: 50,
                    zIndex: 10,
                  }}>
                  {showUsers && (
                    <View style={styles.modal}>
                      <TextInput
                        placeholder="Search..."
                        value={query}
                        onChangeText={text => setQuery(text)}
                      />
                      <Pressable
                        style={styles.selectPress}
                        onPress={handleSelectAll}>
                        <Text style={[styles.item]}>All</Text>
                        {isAllClicked && (
                          <AntDesign name="check" size={20} color="#3632A6" />
                        )}
                      </Pressable>
                      {filterdUser?.length === 0 && (
                        <View style={styles.noData}>
                          <Text style={[styles.noItem]}>No Data Found</Text>
                        </View>
                      )}
                      <FlatList
                        data={filterdUser}
                        renderItem={({item}) => (
                          <Pressable
                            onPress={() => handleReciever(item.user_name)}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <Text style={[styles.item]}>
                                {item?.user_name}
                              </Text>
                              <View style={styles.itemListWrapper} />
                              {recivers.includes(item.user_name) && (
                                <AntDesign
                                  name="check"
                                  size={20}
                                  color="#3632A6"
                                />
                              )}
                            </View>
                          </Pressable>
                        )}
                        //@ts-ignore
                        keyExtractor={(item, index) => index}
                      />
                      {/* <ScrollView
                              style={{
                                maxHeight: 390,
                                backgroundColor: '#F0F0F2',
                                borderRadius: 10,
                              }}>
                              {filterdUser?.map(user => (
                                <Pressable
                                  onPress={() => handleReciever(user.user_name)}
                                  key={user.user_id}
                                  style={styles.selectPress}>
                                  <Text>{user.user_name}</Text>
                                  {recivers.includes(user.user_name) && (
                                    <AntDesign
                                      name="check"
                                      size={20}
                                      color="#3632A6"
                                    />
                                  )}
                                </Pressable>
                              ))}
                            </ScrollView> */}
                    </View>
                  )}
                </View>
              </View>

              <View style={{width: '100%'}}>
                <Text
                  style={{marginBottom: 16, fontSize: 20, fontWeight: '600'}}>
                  Subject
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={subject}
                  onChangeText={text => setSubject(text)}
                />
              </View>
              <View style={{width: '100%'}}>
                <Text
                  style={{marginBottom: 16, fontSize: 20, fontWeight: '600'}}>
                  Body
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textInputBody]}
                  value={body}
                  onChangeText={text => setBody(text)}
                />
              </View>

              <View style={styles.footerContainer}>
                <Pressable
                  disabled={
                    recivers.length === 0 && body === '' && subject === ''
                  }
                  style={[
                    styles.draftButton,
                    {
                      opacity:
                        recivers.length === 0 && body === '' && subject === ''
                          ? 0.6
                          : 1,
                    },
                  ]}
                  onPress={handleDraft}>
                  <Text
                    style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
                    Save to Drafts
                  </Text>
                </Pressable>
                <Pressable
                  disabled={
                    recivers.length === 0 || body === '' || subject === ''
                  }
                  style={[
                    styles.sendButton,
                    {
                      opacity:
                        recivers.length === 0 || body === '' || subject === ''
                          ? 0.6
                          : 1,
                    },
                  ]}
                  onPress={handleSend}>
                  <Text
                    style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
                    Send
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray6,
    width: Platform.OS === 'ios' ? '100%' : '80%',
    maxHeight: Platform.OS === 'ios' ? '90%' : 350,
    backgroundColor: 'white',
    borderRadius: 6,
    overflow: 'hidden',
  },
  noData: {alignItems: 'center', justifyContent: 'center'},
  noItem: {
    paddingVertical: 15,
    fontSize: 17,
  },
  item: {
    fontSize: 17,
    color: COLORS.blackish,
    paddingVertical: 4,
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 20,
    right: 16,
  },
  buttonClose: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8B8B8C',
    borderRadius: 10,
    padding: 10,
  },
  textInputBody: {
    height: 200,
    textAlignVertical: 'top',
  },
  selectButton: {
    backgroundColor: COLORS.primaryBtn,
    width: 160,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectPress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  draftButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 30,
    paddingVertical: 10,
    shadowColor: '#BABCD9',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sendButton: {
    backgroundColor: COLORS.primaryBtn,
    paddingHorizontal: 30,
    paddingVertical: 10,
    shadowColor: '#BABCD9',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
