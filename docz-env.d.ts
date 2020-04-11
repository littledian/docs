declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}
