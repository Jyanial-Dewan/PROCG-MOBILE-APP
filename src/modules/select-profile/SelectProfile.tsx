import {Pressable, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import MainHeader from '../../common/components/MainHeader';
import {useRootStore} from '../../stores/rootStore';
import ContainerNew from '../../common/components/Container';
import CustomFlatList from '../../common/components/CustomFlatList';
import {COLORS} from '../../common/constant/Themes';
import {Checkbox} from 'react-native-paper';
import CustomTextNew from '../../common/components/CustomText';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';

const SelectProfile = () => {
  const {profiles, setSelectedProfile} = useRootStore();
  const [profileString, setProfileString] = useState('');
  const {name} = useRoute();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();

  const handlePress = (profile: string) => {
    setProfileString(profile);
  };

  const handlePressDone = () => {
    setSelectedProfile(profileString);
    navigate('Login');
  };
  return (
    <ContainerNew
      header={<MainHeader routeName={name} />}
      isScrollView={false}
      backgroundColor={COLORS.lightBackground}>
      <CustomFlatList
        data={profiles}
        RenderItems={({item}: any) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={[
              styles.connections,
              profileString === item
                ? {backgroundColor: COLORS.selectedColre}
                : {backgroundColor: COLORS.white},
            ]}>
            <Checkbox
              color="#000000"
              uncheckedColor={COLORS.borderColor}
              status={profileString === item ? 'checked' : 'unchecked'}
            />
            <CustomTextNew text={item} txtWeight={400} txtSize={15} />
          </TouchableOpacity>
          // <TouchableOpacity
          //   onPress={() => handlePress(item)}
          //   style={styles.connections}>
          //   <Checkbox
          //     uncheckedColor={COLORS.lightGray5}
          //     status={profileString === item ? 'checked' : 'unchecked'}
          //   />
          //   <CustomTextNew text={item} txtWeight={400} txtSize={15} />
          // </TouchableOpacity>
        )}
      />
      <Pressable onPress={handlePressDone} style={styles.btnContainer}>
        <Text style={styles.btnText}>{'Done'}</Text>
      </Pressable>
    </ContainerNew>
  );
};

export default SelectProfile;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginVertical: 20,
  },
  connections: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderColor: COLORS.borderColor,
  },
  backArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
    backgroundColor: COLORS.lightGray3,
    borderRadius: 20,
  },
  btnContainer: {
    alignItems: 'center',
    backgroundColor: '#F8D8D9',
    paddingVertical: 20,
  },
  btnText: {
    color: '#E20006',
    fontSize: 16,
  },
});
