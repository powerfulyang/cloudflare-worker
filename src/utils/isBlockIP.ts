import { minimatch } from 'minimatch';

export const isBlockIP = (ip: string | undefined, ips: string) => {
  // ip 如果是 undefined，就直接返回 true，表示不允许访问
  if (!ip) return true;

  const ipList = ips.split('\n');
  return !ipList.some((allowedIP) => minimatch(ip, allowedIP));
};
