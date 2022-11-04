export const SELF = `'self'`;

export async function sha256(content: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(content));
  const arr = Array.from(new Uint8Array(buf));

  const base64 = btoa(arr.map((b) => String.fromCharCode(b)).join(""));

  return `'sha256-${base64}'`;
}

export interface Policies {
  [name: string]: string[];
}

/**
 * Build CSP Header value.
 */
export function build(policies: Policies): string {
  return Object.entries(policies).map(([name, values]) =>
    `${name} ${values.join(" ")}`
  ).join(";");
}
