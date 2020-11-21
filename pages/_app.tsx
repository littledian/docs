import React, { useCallback, useMemo } from 'react';
import NextApp from 'next/app';
import Link from 'next/link';
import { ConfigProvider, Menu } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import styles from './_app.scss';

interface MenuInfo {
  title: string;
  key: string;
  route?: string;
  index?: number;
  children?: MenuInfo[];
}

function sortMenus(menus: MenuInfo[]): MenuInfo[] {
  const res = menus.sort((a, b) => a.index - b.index);
  res.forEach((menu) => {
    if (menu.children?.length) {
      menu.children = sortMenus(menu.children);
    }
  });

  return res;
}

function getMenusFromYamlValue(): MenuInfo[] {
  const menus: MenuInfo[] = [];
  yamlValues.forEach((item) => {
    let { path, value } = item;
    if (value === null || typeof value !== 'object') return;
    const { name, index: indexValue = 100 } = item.value || {};
    if (typeof name !== 'string') return;
    path = path.replace(/\\/g, '/');
    const route = path === 'index' ? '' : path.replace(/(.*)\/index$/, '$1');
    if (!route) {
      menus.push({
        title: name,
        key: path,
        route: '/',
        index: indexValue
      });
      return;
    }
    const array = route.replace(/(.*)\/index$/, '$1').split('/');
    let parent = menus;
    let prevKey = '';
    array.forEach((s, index) => {
      const key = prevKey ? prevKey + '/' + s : s;
      let menu = parent.find((sub) => sub.key === key);
      if (!menu) {
        menu = {
          title: '',
          key,
          route: index === array.length - 1 ? `/${path}` : undefined,
          children: []
        };
        parent.push(menu);
      }
      if (index === array.length - 1) {
        menu.title = name;
        menu.index = indexValue;
      }
      parent = menu.children;
      prevKey = key;
    });
  });

  return sortMenus(menus);
}

const renderMenuItem = (menu: MenuInfo) => {
  if ((menu.children || []).length === 0 && typeof menu.route !== 'string') {
    console.error(`菜单${menu.title}没有子菜单也没有路由`);
    return null;
  }
  if ((menu.children || []).length === 0) {
    return (
      <Menu.Item key={menu.key}>
        <Link href={menu.route}>
          <a>{menu.title}</a>
        </Link>
      </Menu.Item>
    );
  }

  return (
    <Menu.SubMenu key={menu.key} title={menu.title}>
      {menu.children.map(renderMenuItem)}
    </Menu.SubMenu>
  );
};

const menus = getMenusFromYamlValue().map(renderMenuItem);

export interface AppProps {
  pageProps: any;
  defaultExpandKeys: string[];
  defaultSelectedKeys: string[];
}

export default class App extends NextApp<AppProps> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const pathname = ctx.pathname.substring(1);
    const defaultExpandKeys = pathname
      ? pathname.split('/').reduce((prev, val) => {
          if (prev.length === 0) prev.push(val);
          else prev.push(`${prev[prev.length - 1]}/${val}`);
          return prev;
        }, [])
      : [];

    const defaultSelectedKeys = pathname === '' ? ['index'] : [pathname];

    return { pageProps, defaultExpandKeys, defaultSelectedKeys };
  }

  render() {
    const { Component, pageProps, defaultExpandKeys, defaultSelectedKeys } = this.props;

    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.root}>
          <div className={styles.aside}>
            <Menu
              defaultOpenKeys={defaultExpandKeys}
              defaultSelectedKeys={defaultSelectedKeys}
              mode="inline"
            >
              {menus}
            </Menu>
          </div>
          <div className={styles.main}>
            <Component {...pageProps} />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}
