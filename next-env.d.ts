/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare const yamlValues: Array<{ path: string; value: any }>;
