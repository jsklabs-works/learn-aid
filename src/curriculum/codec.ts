/**
 * Light obfuscation for the static English item banks below, so the answers
 * aren't sitting as plain, greppable text in the published source/bundle.
 * This is NOT security — anyone who finds `unpack` can decode it — it just
 * raises the bar above a casual view-source. There's no backend to do this
 * properly; see the README for that tradeoff.
 */
export function unpack<T>(encoded: string): T {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}
