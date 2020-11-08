import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { DocumentProps as NextDocumentProps } from 'next/dist/next-server/lib/utils';
import { getFooterBlock, BlockItem } from '@/services/block';
import { isDev } from '@/utils/env';

interface DocumentProps extends NextDocumentProps {
  block: {
    footer: BlockItem;
  };
}

export default class Document extends NextDocument<DocumentProps> {
  static async getInitialProps(ctx) {
    const [initialProps, footer] = await Promise.all([
      NextDocument.getInitialProps(ctx),
      getFooterBlock()
    ]);
    return { ...initialProps, block: { footer } };
  }

  render() {
    const { block } = this.props;
    const { footer } = block;
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://unpkg.com/antd@4.7.3/dist/antd.min.css"
          />
          <style dangerouslySetInnerHTML={{ __html: footer.css.content }} />
        </Head>
        <body>
          <Main />
          <div
            {...(footer.html.attributes || {})}
            className="footer"
            dangerouslySetInnerHTML={{ __html: footer.html.content }}
          />
          {isDev ? (
            <>
              <script src="https://unpkg.com/react@17.0.1/umd/react.development.js" />
              <script src="https://unpkg.com/react-dom@17.0.1/umd/react-dom.development.js" />
            </>
          ) : (
            <>
              <script src="https://unpkg.com/react@17.0.1/umd/react.production.min.js" />
              <script src="https://unpkg.com/react-dom@17.0.1/umd/react-dom.production.min.js" />
            </>
          )}

          <script src="https://unpkg.com/moment@2.29.1/min/moment-with-locales.min.js" />
          <script src="https://unpkg.com/antd@4.7.3/dist/antd-with-locales.min.js" />
          <script
            {...(footer.js.attributes || {})}
            dangerouslySetInnerHTML={{ __html: footer.js.content }}
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}
