import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomTextNew from '../../common/components/CustomText';
import {COLORS} from '../../common/constant/Themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';
import SVGController from '../../common/components/SVGController';

const SettingsScreen = () => {
  const route = useRoute();
  const routeName = route.name;
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();
  return (
    <ContainerNew
      header={<MainHeader routeName={routeName} />}
      isScrollView={false}
      backgroundColor={COLORS.lightBackground}>
      <View style={styles.lowerContainer}>
        <TouchableOpacity
          onPress={() => navigate('ChooseConnection')}
          style={styles.box}>
          <View style={styles.innerBoxContainer}>
            <SVGController name="Combine" color={COLORS.black} />
            <CustomTextNew
              text={'Choose Connection'}
              txtWeight={400}
              txtSize={15}
            />
          </View>
          <SVGController
            name="Chevron-Right"
            width={18}
            height={18}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('ScanProfiles')}
          style={styles.box}>
          <View style={styles.innerBoxContainer}>
            <SVGController name="Scan-Text" color={COLORS.black} />
            <CustomTextNew
              text={'Scan Profiles'}
              txtWeight={400}
              txtSize={15}
            />
          </View>
          <SVGController
            name="Chevron-Right"
            width={18}
            height={18}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
    </ContainerNew>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  lowerContainer: {
    flex: 1,
    width: '100%',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderColor: COLORS.lightGray5,
    backgroundColor: COLORS.white,
  },
  innerBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
});
