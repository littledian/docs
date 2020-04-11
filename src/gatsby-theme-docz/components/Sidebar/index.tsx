import React, { forwardRef, useMemo } from 'react';
import { MenuItem, useCurrentDoc, useMenus } from 'docz';
import { Menu } from 'antd';
import { Link } from 'gatsby';

const { SubMenu, Item } = Menu;

export const Sidebar = forwardRef(() => {
  const menus = useMenus({});
  const currentDoc = useCurrentDoc();

  const defaultOpenKeys = useMemo(() => {
    function findMenu(menu: MenuItem, id: string): MenuItem | undefined {
      if (menu.id === id) {
        return menu;
      }

      array.push(menu);
      return Array.isArray(menu?.menu) ? menu?.menu?.find((item) => findMenu(item, id)) : undefined;
    }

    let array: MenuItem[] = [];
    for (const menu of menus || []) {
      array = [];
      if (findMenu(menu, currentDoc.id)) {
        return array.map((item) => item.id);
      }
    }
  }, []);

  function mapMenu(menu: MenuItem) {
    if (!menu.route) {
      return (
        <SubMenu key={menu.id} title={menu.name}>
          {menu.menu?.map(mapMenu)}
        </SubMenu>
      );
    }

    return (
      <Item key={menu.id}>
        <Link to={menu.route}>{menu.name}</Link>
      </Item>
    );
  }

  return (
    <Menu mode="inline" selectedKeys={[currentDoc.id]} defaultOpenKeys={defaultOpenKeys}>
      {menus?.map(mapMenu)}
    </Menu>
  );
});
