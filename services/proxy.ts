import http from '@/utils/http';

export enum ProxyStatus {
  running = 1,
  stopped = 2
}

export const proxyStatusMapper = {
  [ProxyStatus.running]: '运行中',
  [ProxyStatus.stopped]: '停止'
};

export interface ProxyItem {
  id: number;
  urlPattern: string;
  proxyServer: string;
  testUrl: string;
  status: ProxyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProxyList(): Promise<ProxyItem[]> {
  return http.get('/api/__/proxy');
}

export function getProxyStatusLabelByCode(code: ProxyStatus) {
  return proxyStatusMapper[code];
}

export function getProxyItemById(id: string | number): Promise<ProxyItem> {
  return http.get(`/api/__/proxy/${id}`);
}

export async function createProxyItem(item: Omit<ProxyItem, 'id' | 'createdAt' | 'updatedAt'>) {
  return http.post('/api/__/proxy', item);
}

export async function updateProxyItem(item: Omit<ProxyItem, 'createdAt' | 'updatedAt'>) {
  return http.put('/api/__/proxy', item);
}
