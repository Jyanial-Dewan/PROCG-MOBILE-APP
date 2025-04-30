import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  ScrollView,
} from 'react-native';

import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../common/constant/Themes';
import SVGController from '../../common/components/SVGController';
import {useRootStore} from '../../stores/rootStore';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';

const MenuMainIndex = observer(() => {
  const {menuStore} = useRootStore();
  const menuData = menuStore.menu;
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});
  const navigation = useNavigation();

  const toggleMenu = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenuItems = (
    subMenus: any[],
    parentKey: string,
    level: number = 1,
  ) => {
    return subMenus.map((item: any, index: number) => {
      const itemKey = `${parentKey}-${item.name}`;

      const isExpandable = item.menuItems?.length > 0;

      return (
        <View key={index} style={styles.menuItem}>
          <TouchableOpacity
            onPress={() => {
              if (isExpandable) {
                toggleMenu(itemKey);
              } else if (item.routeName) {
                navigation.navigate(item.routeName);
              }
            }}
            style={[
              styles.menuItemHeader,
              isExpandable && {backgroundColor: COLORS.lightGray7},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!isExpandable && (
                <Entypo name="dot-single" size={22} color={COLORS.black} />
              )}
              <Text
                style={[styles.menuText, {marginLeft: isExpandable ? 0 : 6}]}>
                {item.name}
              </Text>
            </View>

            {isExpandable && (
              <SVGController name="Chevron-Down" color={COLORS.black} />
            )}
          </TouchableOpacity>

          {isExpandable && openMenus[itemKey] && (
            <View
              style={[
                styles.submenuContainer,
                {paddingLeft: level * 12}, // indent deeper levels
              ]}>
              {renderMenuItems(item.menuItems, itemKey, level + 1)}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <ContainerNew header={<MainHeader routeName="Menu" />}>
      <ScrollView contentContainerStyle={styles.container}>
        {menuData.map((menu, index) => (
          <View key={index} style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuHeader}
              onPress={() => toggleMenu(menu.submenu)}>
              <Text style={styles.menuTitle}>{menu.submenu}</Text>
              <SVGController name="Chevron-Down" color={COLORS.black} />
            </TouchableOpacity>

            {openMenus[menu.submenu] && (
              <View style={styles.menuItemsContainer}>
                {renderMenuItems(menu.subMenus, menu.submenu)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ContainerNew>
  );
});

export default MenuMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  menuItemsContainer: {
    paddingLeft: 20,
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  menuText: {
    fontSize: 14,
    color: '#495057',
  },
  submenuContainer: {
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
