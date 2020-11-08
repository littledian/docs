import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

export interface ModalComponentProps<T> {
  onCancel: () => void;
  afterClose?: () => void;
  onOk: (data: T) => void;
  visible: boolean;
}

export default function createOpen<D, P extends ModalComponentProps<D>>(
  Component: ComponentType<P>
): (props?: Omit<P, keyof ModalComponentProps<D>>) => Promise<D> {
  return (props?: Omit<P, keyof ModalComponentProps<D>>) => {
    return new Promise<D>((resolve, reject) => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      const config: P = {
        ...(props || {}),
        visible: true,
        onOk: handleOk,
        onCancel: handleCancel,
        afterClose: destroy
      } as any;

      function handleCancel() {
        config.visible = false;
        render(config);
        reject(new Error('canceled'));
      }

      function handleOk(data: D) {
        config.visible = false;
        render(config);
        resolve(data);
      }

      function destroy() {
        ReactDOM.unmountComponentAtNode(el);
        document.body.removeChild(el);
      }

      function render(props: P) {
        ReactDOM.render(
          <ConfigProvider locale={zhCN}>
            <Component {...props} />
          </ConfigProvider>,
          el
        );
      }

      render(config);
    });
  };
}
