import React from 'react';
import {Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS, SIZES} from '../constant/Themes';
import Row from './Row';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextNew from './CustomText';

interface props {
  setIsModalShow: any;
  isModalShow: boolean;
  onPressCallApi?: any;
  modalText?: string;
  invalidText?: string;
  showText?: string;
  deleteText?: string;
  isDisabled?: boolean;
}
const CustomQrModel = ({
  setIsModalShow,
  isModalShow,
  onPressCallApi,
  modalText,
  showText,
  invalidText,
  deleteText = 'Not',
  isDisabled = false,
}: props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalShow}
      onRequestClose={() => {
        setIsModalShow(!isModalShow);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={
              Platform.OS === 'ios'
                ? styles.paddingHorizontal30
                : styles.viewStyle
            }>
            {Platform.OS === 'ios' ? (
              <Text style={styles.confermationText}>Confirmation</Text>
            ) : (
              <View>
                <Row justify="center" rowStyle={{marginTop: 16}}>
                  <Feather name="alert-circle" size={24} color={COLORS.red} />
                </Row>
                <Row justify="center" rowStyle={{marginTop: 20}}>
                  <CustomTextNew
                    text={showText}
                    txtColor={COLORS.black}
                    txtSize={14}
                    txtWeight={'600'}
                  />
                </Row>
                <Row justify="center" rowStyle={{marginTop: 10}}>
                  <CustomTextNew
                    text={invalidText}
                    txtColor={COLORS.black}
                    txtSize={14}
                    txtWeight={'300'}
                  />
                </Row>
              </View>
            )}

            <Text style={styles.modalText}>{modalText}</Text>
          </View>

          {Platform.OS === 'android' ? (
            <View style={styles.textBottom}>
              <Pressable
                style={styles.buttonStyle}
                onPress={() => setIsModalShow(!isModalShow)}>
                <Text style={[styles.textStyle]}>OK</Text>
              </Pressable>
              <Pressable
                disabled={isDisabled}
                onPress={() => {
                  onPressCallApi();
                  setIsModalShow(!isModalShow);
                }}>
                {/* <Text style={styles.textStyle}>
                  {deleteText?.toLocaleUpperCase()}
                </Text> */}
              </Pressable>
            </View>
          ) : (
            <View style={styles.cancelTxt}>
              <Pressable onPress={() => setIsModalShow(!isModalShow)}>
                <Text style={styles.cancelDelTxt}>Cancel</Text>
              </Pressable>
              <View style={styles.horizontalDevider} />
              <Pressable
                disabled={isDisabled}
                onPress={() => {
                  onPressCallApi();
                  setIsModalShow(!isModalShow);
                }}>
                <Text style={styles.cancelDelTxt}>{deleteText}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomQrModel;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
  },

  modalView: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    width: 300,
    height: 218,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  viewStyle: {
    marginHorizontal: 18,
    marginTop: 18,
    width: 264,
    height: 160,
    borderRadius: 5,
    backgroundColor: 'rgba(251, 26, 32, 0.15)',
  },
  buttonStyle: {
    backgroundColor: COLORS.primaryBtn,
    borderRadius: 4,
    bottom: 21,
  },

  modalText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.transparentBlack,
    textAlign: Platform.OS === 'ios' ? 'center' : 'auto',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  textStyle: {
    color: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '400',
  },
  textBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1.25,
  },
  paddingRight: {
    marginRight: 20,
  },
  confermationText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    paddingBottom: 6,
  },
  cancelTxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingHorizontal: SIZES.width / 10,
    borderTopColor: COLORS.offDay,
  },
  cancelDelTxt: {
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.primary,
    padding: 12,
    fontWeight: '600',
  },
  horizontalDevider: {
    width: 1,
    backgroundColor: COLORS.offDay,
  },
  paddingHorizontal0: {
    paddingHorizontal: 0,
  },
  paddingHorizontal30: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
    color: '#1C1B1F',
    paddingBottom: 6,
  },
});
