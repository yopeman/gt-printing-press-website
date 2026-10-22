interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  ip: string,
  limit: number = 6,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  // Clean up expired keys periodically if map grows large
  if (ipMap.size > 1000) {
    ipMap.forEach((val, key) => {
      if (now > val.resetTime) {
        ipMap.delete(key);
      }
    });
  }

  if (!record || now > record.resetTime) {
    ipMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
