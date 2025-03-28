import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  ScrollView,
  Image,
} from 'react-native';
import menuData from '../../menu/menu.json';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../common/constant/Themes';
import SVGController from '../../common/components/SVGController';

const MenuMainIndex = () => {
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({});

  const toggleMenu = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenuItems = (menuItems: any, parentKey: string) => {
    return menuItems.map((item: any, index: number) => {
      const itemKey = `${parentKey}-${item.name}`;
      return (
        <View key={index} style={styles.menuItem}>
          <TouchableOpacity
            onPress={() => item.subItems && toggleMenu(itemKey)}
            style={[
              styles.menuItemHeader,
              item.subItems && {backgroundColor: COLORS.lightGray7},
            ]}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
              {!item.subItems && (
                <Entypo name="dot-single" size={24} color="black" />
              )}
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
            {item.subItems && (
              <SVGController name="Chevron-Down" color={COLORS.black} />
            )}
          </TouchableOpacity>

          {item.subItems && openMenus[itemKey] && (
            <View style={styles.submenuContainer}>
              {renderMenuItems(item.subItems, itemKey)}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <ContainerNew header={<MainHeader routeName="Menu" />}>
      <ScrollView style={styles.container}>
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
                {renderMenuItems(menu.menuItems, menu.submenu)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ContainerNew>
  );
};

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
