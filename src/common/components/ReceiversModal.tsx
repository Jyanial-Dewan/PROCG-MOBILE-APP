import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {ProcgURL} from '../../../App';
import {useRootStore} from '../../stores/rootStore';
import {COLORS} from '../constant/Themes';
import CustomTextNew from './CustomText';
import Image from 'react-native-image-fallback';

interface User {
  name: string;
  profile_picture: string;
}

interface ReceiversModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleX: (rcvr: string) => void;
  recivers: User[];
  isHandleX: boolean;
}

const ReceiversModal = ({
  showModal,
  setShowModal,
  handleX,
  recivers,
  isHandleX,
}: ReceiversModalProps) => {
  const {userInfo, selectedUrl} = useRootStore();
  const url = selectedUrl || ProcgURL;
  const fallbacks = [require('../../assets/prifileImages/thumbnail.jpg')];
  return (
    <Modal transparent visible={showModal} animationType="fade">
      {/* Close modal when clicking outside */}
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          {/* Prevent modal from closing when clicking inside */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ScrollView>
                {recivers.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.listConatainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Image
                        style={styles.profileImage}
                        source={{
                          uri: `${url}/${item.profile_picture}`,
                          headers: {
                            Authorization: `Bearer ${userInfo?.access_token}`,
                          },
                        }}
                        fallback={fallbacks}
                      />
                      <CustomTextNew
                        txtColor={COLORS.headerText}
                        text={item.name}
                      />
                    </View>
                    {isHandleX && (
                      <TouchableOpacity onPress={() => handleX(item.name)}>
                        <Feather name="x" size={16} color="black" />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReceiversModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '65%',
    padding: 6,
    borderRadius: 10,
    maxHeight: 350,
    position: 'absolute',
    top: 110,
    right: 20, // Ensures scrollability
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listConatainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomColor: COLORS.lightGray,
    borderBottomWidth: 0.5,
  },
});
