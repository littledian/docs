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
  children?: MenuInfo[];
}

function getMenusFromYamlValue(): MenuInfo[] {
  const menus: MenuInfo[] = [];
  yamlValues.forEach((item) => {
    if (item.value === null || typeof item.value !== 'object') return;
    const { name, route } = item.value;
    if (typeof name !== 'string' || typeof route !== 'string') return;
    const array = name.split('/');
    let parent = menus;
    let prevKey = '';
    array.forEach((s, index) => {
      let menu = parent.find((sub) => sub.title === 's');
      if (!menu)
        menu = {
          title: s,
          key: prevKey + s,
          route: index === array.length - 1 ? route : undefined
        };
      parent.push(menu);
      parent = menu.children || [];
      prevKey += `/${s}`;
    });
  });

  return menus;
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

  return <Menu.SubMenu key={menu.key}>{menu.children.map(renderMenuItem)}</Menu.SubMenu>;
};

const menus = getMenusFromYamlValue().map(renderMenuItem);

export default class App extends NextApp<{ pageProps: any }> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.root}>
          <div className={styles.aside}>
            <Menu>{menus}</Menu>
          </div>
          <div className={styles.main}>
            <Component {...pageProps} />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}
