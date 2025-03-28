import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {Fragment, useState} from 'react';
import {Controller} from 'react-hook-form';
import {Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constant/Themes';

interface Props {
  rules?: {};
  name: string;
  control: any;
  setValue?: any;
  onChange?: any;
  label?: string;
}

const CustomTimePickerNew = ({
  name,
  control,
  setValue,
  rules,
  onChange,
  label,
}: Props) => {
  const iosTime = Platform.OS === 'ios' && dayjs(new Date()).format('LT');
  var localizedFormat = require('dayjs/plugin/localizedFormat');
  dayjs.extend(localizedFormat);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const showTimepicker = () => {
    if (Platform.OS === 'ios') {
      setShow(!show);
    } else {
      setShow(true);
    }
  };

  const handleOnChange = (selectedDate: string) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      const selectedTime = dayjs(selectedDate)?.format('LT');
      if (Platform.OS === 'ios') {
        //@ts-ignore
        setDate(selectedDate);
      }
      if (onChange) {
        onChange(selectedTime);
      } else {
        setValue(name, selectedTime);
      }
    }
  };

  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value}, fieldState: {error}}) => (
          <>
            <View>
              {Platform.OS === 'ios' ? (
                <Text style={[styles.newLabelIOS]}>{label}</Text>
              ) : null}
              <Pressable onPress={() => showTimepicker()}>
                <View>
                  {Platform.OS === 'android' ? (
                    <Text style={[styles.newLabel]}>{label}</Text>
                  ) : null}
                  <View
                    style={[
                      Platform.OS === 'ios' ? styles.newBoxIOS : styles.newBox,
                      {
                        borderBottomColor:
                          value || iosTime
                            ? COLORS.offDay
                            : error
                            ? 'red'
                            : COLORS.offDay,
                      },
                    ]}>
                    <Text
                      style={[
                        Platform.OS === 'ios'
                          ? styles.newSelectedItemIOS
                          : styles.newSelectedItem,
                        {
                          color:
                            value || iosTime
                              ? COLORS.textNewColor
                              : COLORS.transparentDark,
                        },
                      ]}>
                      {value || iosTime}
                    </Text>
                    {Platform.OS === 'android' ? (
                      <Icon
                        style={styles.newCalenderIcon}
                        name="clock-outline"
                        color={COLORS.iconColor}
                        size={24}
                      />
                    ) : null}
                  </View>
                  {value ? null : (
                    <>
                      {error && (
                        <Text style={[styles.error]}>{error?.message}</Text>
                      )}
                    </>
                  )}
                </View>
              </Pressable>
            </View>

            {/* Android Date Picker */}
            {show && Platform.OS === 'android' && (
              <DateTimePicker
                testID="dateTimePisdcker"
                value={new Date()}
                mode="time"
                locale={'en'}
                //@ts-ignore
                onChange={(e: any, selectedDate: string) =>
                  handleOnChange(selectedDate)
                }
              />
            )}

            {/* IOS date picker */}
            {Platform.OS === 'ios' && (
              <Modal visible={show} animationType="slide" transparent={true}>
                <View style={styles.iosModaContentWrapper}>
                  <View style={styles.iosModaContent}>
                    <View style={styles.head}>
                      <Pressable onPress={() => setShow(false)}>
                        <Text style={styles.cancelDone}>Cancel</Text>
                      </Pressable>

                      <Pressable onPress={() => setShow(!show)}>
                        <Text style={styles.cancelDone}>Done</Text>
                      </Pressable>
                    </View>
                    <DateTimePicker
                      textColor={COLORS.textNewColor}
                      testID="dateTimePicker"
                      value={date}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      //@ts-ignore
                      onChange={(e: any, selectedDate: string) =>
                        handleOnChange(selectedDate)
                      }
                    />

                    {/* <TouchableOpacity onPress={() => setShow(!show)} style={styles.iosBtnWrapper}>
                      <Icon style={styles.icon} name="check" color="white" size={25} />
                    </TouchableOpacity> */}
                  </View>
                </View>
              </Modal>
            )}
          </>
        )}
      />
    </Fragment>
  );
};

export default CustomTimePickerNew;

const styles = StyleSheet.create({
  newLabel: {
    fontSize: 14,
    position: 'absolute',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  newLabelIOS: {
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.textNewBold,
    paddingBottom: 2,
    fontWeight: '600',
  },
  newSelectedItem: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    bottom: -22,
  },
  newSelectedItemIOS: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingLeft: 16,
  },
  newBox: {
    height: 55,
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offDay,
  },

  newBoxIOS: {
    height: 44,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.offDay,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  newCalenderIcon: {alignSelf: 'flex-end', bottom: 1.7},
  error: {
    position: 'absolute',
    color: 'red',
    fontSize: 10,
    bottom: -20,
    marginBottom: 5,
    width: '100%',
    paddingTop: 3,
  },

  iosModaContentWrapper: {
    flex: 1,
    backgroundColor: '#121E4499',
    paddingBottom: 60,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  iosModaContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  cancelDone: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 5,
  },
  head: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offDay,
    paddingBottom: 10,
  },
});
