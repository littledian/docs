import axios from 'axios';
import { isBrowser } from './env';

let host = '';
if (!isBrowser) {
  host = process.env.REMOTE_HOST || 'http://127.0.0.1:7001';
}

const instance = axios.create({
  baseURL: host
});

instance.interceptors.response.use((res) => {
  const { data } = res;
  if (typeof data.status !== 'object') {
    return res.data;
  }
  const { code, description } = data.status;
  if (code !== 0) {
    throw new Error(description);
  }
  res.data = data.result;
  return data.result;
});

export default instance;
