import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../constant/Index';
import CustomTextNew from './CustomText';

const NoData = ({data}: any) => {
  const dataLength = data || 0;
  return (
    <>
      {dataLength === 0 ? (
        <View style={styles.main}>
          <FastImage source={IMAGES.NoDataImage} style={styles.image} />
          <CustomTextNew text={'No Data Found'} txtAlign={'center'} />
        </View>
      ) : null}
    </>
  );
};

export default NoData;

const styles = StyleSheet.create({
  main: {alignSelf: 'center', paddingTop: 20},
  image: {width: 130, height: 90, marginBottom: 10},
});
