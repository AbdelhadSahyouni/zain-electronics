// Server-safe sanitization — DOMPurify only works in browser,
// so we use a simple strip approach on the server
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // strip angle brackets
    .replace(/javascript:/gi, "") // strip js: protocol
    .replace(/on\w+\s*=/gi, "") // strip event handlers
    .trim()
    .slice(0, 5000); // max length guard
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(sanitized[key] as string);
    }
  }
  return sanitized;
}
