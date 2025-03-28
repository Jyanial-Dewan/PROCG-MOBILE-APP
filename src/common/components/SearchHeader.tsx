import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../constant/Themes';

const SearchHeader = ({
  setIsSearch,
  isSearch,
  inputText,
  setInputText,
}: // setState = {},
// isState = false,
// defaultValues = {},
any) => {
  return (
    <View style={styles.search}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => {
          // if (isState) {
          //   setState(defaultValues);
          // }
          setIsSearch(!isSearch);
          setInputText('');
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        }}>
        <Icon name="arrow-back" size={27} color={COLORS.iconColor} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
      />

      {inputText ? (
        <TouchableOpacity
          onPress={() => {
            setInputText('');
            // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          }}
          style={styles.closeIcon}>
          <Icon
            name="close"
            size={Platform.OS === 'ios' ? 15 : 20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  search: {
    // height: 40,
    marginTop: Platform.OS === 'ios' ? 55 : 60,
    width: SIZES.width / 1.022,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 5,
    zIndex: 9999,
  },
  input: {
    flexGrow: 1,
    borderWidth: 1,
    marginLeft: 10,
    borderRadius: 4,
    overflow: 'hidden',
    borderColor: COLORS.borderBottom,
    backgroundColor: COLORS.lightGray7,
    paddingLeft: 20,
    color: COLORS.textNewColor,
    fontSize: 15,
    width: SIZES.width / 1.23,
    paddingRight: 30,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
  },
  backIcon: {
    paddingVertical: 5,
  },
  closeIcon: {
    position: 'relative',
    zIndex: 9999,
    marginLeft: -30,
    backgroundColor: '#323232',
    borderRadius: 50,
    padding: 2,
  },
});
