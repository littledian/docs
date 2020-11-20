import http from '@/utils/http';

export interface BlockItem {
  html: {
    attributes?: any;
    content: string;
  };
  css: {
    attributes?: any;
    content: string;
  };
  js: {
    attributes?: any;
    content: string;
  };
}

export function getFooterBlock(): Promise<BlockItem> {
  return http.get('/api/block/footer');
}
