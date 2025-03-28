import React, {useRef, useState} from 'react';
import {Controller} from 'react-hook-form';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../constant/Themes';
import RBSheet from '../packages/RBSheet/RBSheet';

interface Props {
  rules?: {};
  data?: any;
  setValue?: any;
  onChange?: any;
  name: string;
  control: any;
  placholder?: string;
  rightIcon?: string;
  isIconShow?: boolean;
  boxStyle?: {};
  label?: string;
  selectedItemStyle?: {};
  isDisable?: boolean;
  setSearchText?: any;
  searchText?: string;
  isImportant?: boolean;
  labelStyle?: TextStyle;
}

const CustomDropDownNew = ({
  data,
  setValue,
  onChange,
  name,
  control,
  placholder,
  rules,
  rightIcon,
  isIconShow = true,
  boxStyle,
  label,
  selectedItemStyle,
  isDisable = false,
  setSearchText,
  searchText,
  isImportant,
  labelStyle,
}: Props) => {
  const refRBSheet = useRef();
  const [isModalShow, setIsModalShow] = useState(false);

  const handleSelect = (item: any) => {
    setIsModalShow(false);
    if (Platform.OS === 'ios') {
      //@ts-ignore
      refRBSheet.current.close();
    }
    if (onChange) {
      onChange(item);
    } else {
      setValue(name, item);
    }
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value}, fieldState: {error}}) => (
          <>
            <Pressable
              disabled={isDisable}
              style={[
                styles.newMainIOS,
                boxStyle,
                {
                  borderBottomColor: value
                    ? COLORS.offDay
                    : error
                    ? 'red'
                    : COLORS.offDay,
                  borderColor: value
                    ? COLORS.offDay
                    : error
                    ? Platform.OS === 'ios'
                      ? COLORS.offDay
                      : 'red'
                    : COLORS.offDay,

                  backgroundColor: isDisable ? COLORS.lightGray3 : '#f9f9f9',
                },
              ]}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  //@ts-ignore
                  refRBSheet.current.open();
                } else {
                  setIsModalShow(true);
                }
              }}>
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.newLabel,
                    labelStyle,
                    {
                      top: value?.label ? -12 : 10,
                      backgroundColor: isDisable
                        ? COLORS.lightGray3
                        : COLORS.white,
                    },
                  ]}>
                  {label}
                </Text>
              </View>

              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.newSelectedItemIOS,
                    {
                      color: value?.label
                        ? COLORS.textNewColor
                        : COLORS.transparentDark,
                    },
                    selectedItemStyle,
                  ]}>
                  {value?.label
                    ? value?.label?.length > 30
                      ? value?.label?.slice(0, 30) + '...'
                      : value?.label
                    : Platform.OS === 'ios'
                    ? placholder || 'Choose'
                    : null}
                </Text>
              </View>

              {value?.label ? null : (
                <>
                  {error && (
                    <Text numberOfLines={1} style={[styles.error]}>
                      {error?.message}
                    </Text>
                  )}
                </>
              )}
              {isIconShow && (
                <Icon
                  style={styles.newRightIconIOS}
                  name={rightIcon || 'caretdown'}
                  color={isDisable ? COLORS.lightGray6 : COLORS.graySubText}
                  size={15}
                />
              )}
            </Pressable>
          </>
        )}
      />

      {/* for android devices */}
      <Modal visible={isModalShow} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsModalShow(!isModalShow)}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                {setSearchText && (
                  <TextInput
                    value={searchText}
                    style={styles.input}
                    onChangeText={(e: any) => setSearchText(e)}
                    placeholder="Search (min 3 letter)"
                    multiline
                  />
                )}
                {data?.length === 0 && (
                  <View style={styles.noData}>
                    <Text style={[styles.noItem]}>No Data Found</Text>
                  </View>
                )}
                <FlatList
                  data={data}
                  renderItem={({item}) => (
                    <Pressable onPress={() => handleSelect(item)}>
                      <View>
                        <Text style={[styles.item]}>{item?.label}</Text>
                        <View style={styles.itemListWrapper} />
                      </View>
                    </Pressable>
                  )}
                  //@ts-ignore
                  keyExtractor={(item, index) => index}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* for ios devices */}
      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 1.4}
        duration={250}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
          },
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.modal}>
            {setSearchText && (
              <TextInput
                value={searchText}
                style={styles.input}
                onChangeText={(e: any) => setSearchText(e)}
                multiline
                placeholder="Search (min 3 letter)"
              />
            )}
            {data?.length === 0 && (
              <View style={styles.noData}>
                <Text style={[styles.noItem]}>No Data Found</Text>
              </View>
            )}
            <FlatList
              data={data}
              renderItem={({item}) => (
                <Pressable onPress={() => handleSelect(item)}>
                  <View>
                    <Text style={[styles.item]}>{item?.label}</Text>
                    <View style={styles.itemListWrapper} />
                  </View>
                </Pressable>
              )}
              //@ts-ignore
              keyExtractor={(item, index) => index}
            />
          </View>
        </TouchableWithoutFeedback>
      </RBSheet>
    </>
  );
};

export default CustomDropDownNew;

const styles = StyleSheet.create({
  newMain: {
    borderBottomWidth: 1,
    borderColor: COLORS.offDay,
    paddingBottom: 5,
    flex: 1,
    justifyContent: 'space-between',
    height: 55,
  },
  newLabel: {
    fontSize: 16,
    position: 'absolute',
    lineHeight: 20,
    color: COLORS.graySubText,
    top: 10,
  },
  newLabelIos: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: COLORS.textNewBold,
    paddingBottom: 2,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: Platform.OS === 'ios' ? '100%' : '90%',
    height: Platform.OS === 'ios' ? '90%' : '80%',
    backgroundColor: 'white',
    borderRadius: 10,
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
    paddingTop: 15,
  },
  newSelectedItem: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  newSelectedItemIOS: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingTop: 8,
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 8,
  },
  error: {
    position: 'absolute',
    color: 'red',
    fontSize: 10,
    bottom: -22,
    marginBottom: 5,
    width: '108%',
  },
  newRightIcon: {position: 'absolute', right: 2, marginTop: 30},
  newRightIconIOS: {position: 'absolute', right: 10, marginTop: 15},
  newMainIOS: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 46,
    backgroundColor: '#f9f9f9',
    paddingTop: 2,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderColor: COLORS.borderBottom,
    paddingVertical: 12,
    color: COLORS.textNewColor,
    // minHeight: 45,
  },
});
