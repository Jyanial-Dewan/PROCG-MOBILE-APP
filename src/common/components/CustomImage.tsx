import React, {Fragment} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../constant/Index';
import {getImageURL} from '../services/getImage';

interface Props {
  imageId?: number | string | null | undefined;
  localImage?: any;
  imgStyle?: {};
  resizeMode?: string;
}

const CustomImageNew = ({
  imageId,
  localImage,
  imgStyle,
  resizeMode = 'cover',
}: Props) => {
  return (
    <Fragment>
      <FastImage
        //@ts-ignore
        resizeMode={resizeMode}
        style={[imgStyle || styles.image]}
        source={
          imageId
            ? {
                uri: getImageURL(imageId),
              }
            : localImage || IMAGES.NoImage
        }
      />
    </Fragment>
  );
};

export default CustomImageNew;

const styles = StyleSheet.create({
  image: {
    height: 45,
    width: 45,
    borderRadius: 100,
  },
});
