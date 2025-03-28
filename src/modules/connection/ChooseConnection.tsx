import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import CustomTextNew from '../../common/components/CustomText';
import Plus from 'react-native-vector-icons/Octicons';
import {COLORS} from '../../common/constant/Themes';
import {Checkbox} from 'react-native-paper';
import RoundedButton from '../../common/components/RoundedButton';
import {observer} from 'mobx-react-lite';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useRootStore} from '../../stores/rootStore';
import CustomFlatList from '../../common/components/CustomFlatList';
import CustomQrModel from '../../common/components/CustomInvalidModal';
import SVGController from '../../common/components/SVGController';

const PlusIcon = () => {
  return <Plus name="plus" size={24} color="gray" />;
};

const Last = () => {
  const navigation = useNavigation();
  return (
    <RoundedButton
      child={<SVGController name="Plus" color="#41596B" />}
      onPress={() => navigation.navigate('AddConnection')}></RoundedButton>
  );
};

const ChooseConnection = observer(() => {
  const [isModalShow, setIsModalShow] = useState(false);
  const rootStore = useRootStore();
  const isFocused = useIsFocused();
  type RouteParams = {
    ChooseConnection: {
      url?: string;
    };
  };
  const route = useRoute<RouteProp<RouteParams, 'ChooseConnection'>>();
  const invalidUrl = route.params?.url;

  useEffect(() => {
    if (invalidUrl === 'Invalid') {
      setIsModalShow(true);
    }
  }, [invalidUrl]);

  useEffect(() => {
    if (isFocused) {
      rootStore.hydrate();
    }
  }, [isFocused, rootStore.selectedUrl, rootStore.urls]);

  const handleCheckboxChange = (url: string) => {
    rootStore.setSelectedUrl(url);
  };

  return (
    <ContainerNew
      header={<MainHeader routeName="Choose_Connection" last={<Last />} />}
      isScrollView={false}
      backgroundColor={COLORS.lightBackground}>
      <CustomFlatList
        data={rootStore.urls}
        RenderItems={({item}: any) => (
          <View
            style={[
              styles.connections,
              rootStore.isSelected(item)
                ? {backgroundColor: COLORS.selectedColre}
                : {backgroundColor: COLORS.white},
            ]}>
            <Checkbox
              color="#000000"
              uncheckedColor={COLORS.borderColor}
              status={rootStore.isSelected(item) ? 'checked' : 'unchecked'}
              onPress={() => {
                handleCheckboxChange(item);
                console.log(item);
              }}
            />
            <CustomTextNew text={item} txtWeight={400} txtSize={15} />
          </View>
        )}
      />
      <CustomQrModel
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        showText="Unable to Add Connection"
        invalidText="Invalid Url. Please try again"
      />
    </ContainerNew>
  );
});
export default ChooseConnection;

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
});
