import axios from 'axios';

const BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: BASE, timeout: 30000 });

export const getSessionId = () => {
  let sid = localStorage.getItem('protooly_sid');
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
    localStorage.setItem('protooly_sid', sid);
  }
  return sid;
};

export const trackTool = (slug) => {
  try { api.post('/track', { slug, sessionId: getSessionId() }).catch(() => {}); } catch {}
};

export const getPopular = (limit = 12) => api.get('/popular', { params: { limit } }).then(r => r.data);

export const getFavorites = () => api.get(`/favorites/${getSessionId()}`).then(r => r.data);
export const toggleFavorite = (slug) => api.post(`/favorites/${getSessionId()}`, { slug }).then(r => r.data);

// Network tools
export const netHttpStatus = (url) => api.post('/net/http-status', { url }).then(r => r.data);
export const netHeaders = (url) => api.post('/net/headers', { url }).then(r => r.data);
export const netPageSize = (url) => api.post('/net/page-size', { url }).then(r => r.data);
export const netDomainToIp = (domain) => api.post('/net/domain-to-ip', { domain }).then(r => r.data);
export const netDnsRecords = (domain) => api.post('/net/dns-records', { domain }).then(r => r.data);
export const netServerStatus = (url) => api.post('/net/server-status', { url }).then(r => r.data);
export const netRedirectChain = (url) => api.post('/net/redirect-chain', { url }).then(r => r.data);
export const sendContact = (payload) => api.post('/contact', payload).then(r => r.data);
