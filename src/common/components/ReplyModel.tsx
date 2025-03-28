import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {useRootStore} from '../../stores/rootStore';
import {httpRequest} from '../constant/httpRequest';
import {api} from '../api/api';
import {ProcgURL} from '../../../App';
import {useToast} from './CustomToast';
import {COLORS} from '../constant/Themes';
import {observer} from 'mobx-react-lite';
import {useSocketContext} from '~/context/SocketContext';

interface ReplyModalProps {
  subject: string;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  involvedusers: string[];
  parrentMessage: any;
  setTotalMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const ReplyModal = observer(
  ({
    subject: sub,
    modalVisible,
    setModalVisible,
    involvedusers,
    parrentMessage,
    setTotalMessages,
  }: ReplyModalProps) => {
    const {userInfo} = useRootStore();
    const {socket} = useSocketContext();
    const [subject, setSubject] = useState<string>(sub);
    const [body, setBody] = useState<string>('');
    const [isSending, setIsSending] = useState(false);

    const sender = userInfo?.user_name;
    const id = uuidv4();
    const toaster = useToast();
    const recivers = involvedusers.filter(usr => usr !== userInfo?.user_name);

    const handleSend = async () => {
      const sendPayload = {
        id,
        sender,
        recivers,
        subject: `Re: ${subject}`,
        body,
        date: new Date(),
        status: 'Sent',
        parentid: parrentMessage.id,
        involvedusers,
        readers: recivers,
        holders: involvedusers,
        recyclebin: [],
      };
      const sendParams = {
        url: api.Messages,
        data: sendPayload,
        method: 'post',
        baseURL: ProcgURL,
        isConsole: true,
        // isConsoleParams: true,
      };
      try {
        setIsSending(true);
        const response = await httpRequest(sendParams, setIsSending);
        if (response) {
          setTotalMessages(prev => [sendPayload, ...prev]);
          socket?.emit('sendMessage', sendPayload);
          toaster.show({message: 'Message Sent Successfully', type: 'success'});
        }
      } catch (error) {
        if (error instanceof Error) {
          toaster.show({message: error.message, type: 'error'});
        }
      } finally {
        // setSubject('');
        setBody('');
      }
    };

    return (
      <View style={styles.centeredView}>
        {isSending ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{width: '100%', alignItems: 'flex-end'}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name="close" size={24} color="black" />
                </Pressable>
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
                  value={body}
                  onChangeText={text => setBody(text)}
                  multiline={true}
                  style={[styles.textInput, styles.textInputBody]}
                />
              </View>

              <View style={styles.footerContainer}>
                <Pressable
                  disabled={
                    body.length === 0 ||
                    body === '' ||
                    involvedusers.length === 0
                  }
                  style={[
                    styles.sendButton,
                    {
                      opacity:
                        body.length === 0 ||
                        body === '' ||
                        involvedusers.length === 0
                          ? 0.6
                          : 1,
                    },
                  ]}
                  onPress={handleSend}>
                  <Text
                    style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
                    Reply
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

export default ReplyModal;

const styles = StyleSheet.create({
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
    backgroundColor: '#3632A6',
    position: 'absolute',
    bottom: -10,
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
    backgroundColor: '#8F92BF',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectPress: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
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
