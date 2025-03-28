import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import RoundedButton from './RoundedButton';
import SVGController from './SVGController';

interface HeaderProps {
  routeName: string;
  last?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const Header = ({routeName, last, style}: HeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <RoundedButton
        onPress={() => navigation.goBack()}
        child={<SVGController name="Arrow-Left" color="#41596B" />}
      />
      <Text
        style={[
          {
            color: '#171717',
            fontSize: 16,
            fontWeight: '700',
          },
          style,
        ]}>
        {routeName.replace(/_/g, ' ')}
      </Text>
      {last ? last : <Text style={{width: 24}}></Text>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});
