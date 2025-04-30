import {Instance, SnapshotOut, types} from 'mobx-state-tree';

const MenuItemModel = types.model('menuItemModel', {
  name: types.string,
  routeName: types.union(types.string, types.undefined, types.null),
});

const SubMenusModel = types.model('subMenusModel', {
  name: types.string,
  routeName: types.maybe(types.string),
  menuItems: types.optional(types.array(MenuItemModel), []),
  order: types.number,
});

export const subMenuModel = types.model('subMenuModel', {
  submenu: types.string,
  subMenus: types.array(SubMenusModel),
});

export const MenuStore = types
  .model('menuStore', {
    menu: types.array(subMenuModel),
  })
  .actions(self => ({
    saveMobileMenu(submenus: Array<MenuSnapshotType>) {
      try {
        const validsubmenus = submenus.map(menu => subMenuModel.create(menu));
        console.log(validsubmenus, 'mobileMenuStore 27');

        self.menu.replace(validsubmenus);
      } catch (err) {
        console.error('Menu parsing error:', err);
      }
    },
  }));

export type MenuType = Instance<typeof subMenuModel>;
export type MenuSnapshotType = SnapshotOut<typeof subMenuModel>;
