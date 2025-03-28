import DateTimePicker from '@react-native-community/datetimepicker';
import React, {Fragment, useState} from 'react';
import dayjs from 'dayjs';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Controller} from 'react-hook-form';
import {COLORS} from '../constant/Themes';
import {date_formater} from '../services/dateFormater';
import {_todayDate} from '../services/todayDate';
import MIcon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  rules?: {};
  name: string;
  control: any;
  placholder?: string;
  setValue?: any;
  minimumDate?: string;
  maximumDate?: string;
  onChange?: any;
  label?: string;
  isDisable?: boolean;
  isImportant?: boolean;
}

const CustomDatePickerNew = ({
  name,
  control,
  placholder,
  setValue,
  rules,
  minimumDate,
  maximumDate,
  onChange,
  label,
  isDisable,
  isImportant,
}: Props) => {
  const [show, setShow] = useState(false);
  const maxDateFormated = dayjs(maximumDate).format(
    'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  );
  const minDateFormated = dayjs(minimumDate).format(
    'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  );
  const showDatepicker = () => {
    if (Platform.OS === 'ios') {
      setShow(!show);
    } else {
      setShow(true);
    }
  };
  const handleOnChange = (selectedDate: string) => {
    if (selectedDate) {
      // if (Platform.OS === 'ios') {
      //   setValue(name, selectedDate);
      // }
      if (Platform.OS === 'android') {
        setShow(false);
      }
      if (onChange) {
        onChange(selectedDate);
      } else {
        setValue(name, selectedDate);
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
              {/* {Platform.OS === 'ios' ? (
                <Text style={[styles.newLabelIOS]}>
                  {label}

                  {isImportant ? (
                    <MIcon
                      name={'stars'}
                      color={COLORS.warning}
                      size={12}
                      style={{
                        fontWeight: '500',
                      }}
                    />
                  ) : null}
                </Text>
              ) : null} */}
              <TouchableOpacity
                disabled={isDisable}
                activeOpacity={0.7}
                onPress={() => showDatepicker()}>
                <View>
                  {value ? (
                    <View>
                      <Text style={[styles.newLabel]}>{label}</Text>
                    </View>
                  ) : null}

                  <View
                    style={[
                      styles.newBoxIOS,
                      {
                        borderBottomColor: value
                          ? COLORS.offDay
                          : error
                          ? 'red'
                          : COLORS.offDay,
                      },
                    ]}>
                    <Text style={[styles.newSelectedItem]}>
                      {value ? date_formater(value) : placholder}
                    </Text>

                    <Icon
                      style={[styles.newCalenderIcon]}
                      name="calendar-outline"
                      color={COLORS.graySubText}
                      size={23}
                    />
                  </View>
                  {value ? null : (
                    <>
                      {error && (
                        <Text style={[styles.error]}>{error?.message}</Text>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {show && Platform.OS === 'android' && (
              <DateTimePicker
                timeZoneOffsetInMinutes={0}
                testID="dateTimePicker"
                value={new Date(value || _todayDate())}
                mode="date"
                is24Hour={true}
                display="default"
                //@ts-ignore
                onChange={(e: any, selectedDate: string) =>
                  handleOnChange(selectedDate)
                }
                minimumDate={
                  minimumDate ? new Date(minDateFormated) : new Date(1900, 1, 1)
                }
                maximumDate={
                  maximumDate ? new Date(maxDateFormated) : new Date(4050, 1, 1)
                }
              />
            )}

            {/* IOS date picker */}
            {Platform.OS === 'ios' && (
              <Modal visible={show} animationType={'fade'} transparent={true}>
                <View style={styles.iosModaContentWrapper}>
                  <View style={styles.iosModaContent}>
                    <View style={styles.head}>
                      <TouchableOpacity onPress={() => setShow(false)}>
                        <Text style={styles.cancelDone}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setShow(!show)}>
                        <Text style={styles.cancelDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      textColor={COLORS.textNewColor}
                      timeZoneOffsetInMinutes={0}
                      testID="dateTimePicker"
                      value={new Date(value || _todayDate())}
                      mode="date"
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

export default CustomDatePickerNew;

const styles = StyleSheet.create({
  newLabel: {
    fontSize: 14,
    position: 'absolute',
    lineHeight: 20,
    color: COLORS.graySubText,
    top: -10,
    zIndex: 99,
    marginLeft: 10,
    backgroundColor: COLORS.white,
  },
  newLabelIOS: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: COLORS.textNewBold,
    paddingBottom: 2,
  },
  newBox: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: 'center',
    paddingVertical: 0,
    borderBottomColor: COLORS.offDay,
    paddingTop: 26,
    paddingBottom: 5,
  },
  newBoxIOS: {
    overflow: 'hidden',
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    paddingVertical: 0,
    borderColor: COLORS.offDay,
    borderRadius: 10,
    height: 44,
    backgroundColor: '#f9f9f9',
  },
  newCalenderIcon: {position: 'absolute', right: 6, bottom: 7},
  error: {
    position: 'absolute',
    color: 'red',
    fontSize: 10,
    bottom: -20,
    marginBottom: 5,
    width: '100%',
    paddingTop: 3,
  },
  newSelectedItem: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  iosModaContentWrapper: {
    flex: 1,
    backgroundColor: '#121E4499',
    paddingHorizontal: 16,
    paddingBottom: 65,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  iosModaContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    paddingTop: 16,
  },
  cancelDone: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 5,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    paddingBottom: 10,
  },
});
