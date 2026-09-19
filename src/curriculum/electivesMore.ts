import type { Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt, shuffle } from "./utils";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const round = (n: number, dp = 2) => +n.toFixed(dp);
const pickDistinct = <T,>(arr: readonly T[], count: number): T[] => shuffle(arr).slice(0, count);

const SOURCE_DOCS: [string, string][] = unpack("W1siaXMgc2VudCB0byBhIGN1c3RvbWVyIHRvIHJlcXVlc3QgcGF5bWVudCBmb3IgZ29vZHMgc29sZCBvbiBjcmVkaXQiLCJzYWxlcyBpbnZvaWNlIl0sWyJpcyByZWNlaXZlZCBmcm9tIGEgc3VwcGxpZXIgZm9yIGdvb2RzIGJvdWdodCBvbiBjcmVkaXQiLCJwdXJjaGFzZSBpbnZvaWNlIl0sWyJpcyBnaXZlbiB0byBhIGN1c3RvbWVyIGFzIHByb29mIHRoYXQgdGhleSBwYWlkIiwicmVjZWlwdCJdLFsiaXMgaXNzdWVkIHRvIGEgY3VzdG9tZXIgd2hvIHJldHVybnMgZ29vZHMsIHJlZHVjaW5nIHRoZSBhbW91bnQgdGhleSBvd2UiLCJjcmVkaXQgbm90ZSJdLFsiaXMgYSB3cml0dGVuIG9yZGVyIHRvIGEgYmFuayB0byBwYXkgYSBzdGF0ZWQgYW1vdW50IHRvIGEgcGVyc29uIiwiY2hlcXVlIl0sWyJyZWNvcmRzIG1vbmV5IHBhaWQgaW50byBhIGJhbmsgYWNjb3VudCIsImRlcG9zaXQgc2xpcCJdLFsibGlzdHMgYWxsIHRoZSB0cmFuc2FjdGlvbnMgb24gYSBiYW5rIGFjY291bnQgZm9yIGEgcGVyaW9kIiwiYmFuayBzdGF0ZW1lbnQiXSxbImlzIHNlbnQgdG8gYSBzdXBwbGllciB0byBvcmRlciBnb29kcyIsInB1cmNoYXNlIG9yZGVyIl0sWyJsaXN0cyBhIGN1c3RvbWVyJ3MgcHVyY2hhc2VzIGFuZCBwYXltZW50cyBmb3IgdGhlIG1vbnRoIiwic3RhdGVtZW50IG9mIGFjY291bnQiXSxbInJlY29yZHMgdGhlIHdhZ2VzIHBhaWQgdG8gYW4gZW1wbG95ZWUgZm9yIGEgcGF5IHBlcmlvZCIsInBheXNsaXAiXV0=");
const LIFE_CYCLE: [string, string][] = unpack("W1siU2FsZXMgYXJlIGxvdyBhbmQgdGhlIGJ1c2luZXNzIHNwZW5kcyBoZWF2aWx5IG9uIGFkdmVydGlzaW5nIHRvIG1ha2UgcGVvcGxlIGF3YXJlIiwiaW50cm9kdWN0aW9uIl0sWyJTYWxlcyByaXNlIHF1aWNrbHkgYW5kIGNvbXBldGl0b3JzIHN0YXJ0IHRvIGVudGVyIHRoZSBtYXJrZXQiLCJncm93dGgiXSxbIlNhbGVzIGxldmVsIG9mZiBhbmQgdGhlIG1hcmtldCBpcyBjcm93ZGVkIHdpdGggc2ltaWxhciBwcm9kdWN0cyIsIm1hdHVyaXR5Il0sWyJTYWxlcyBmYWxsIGFzIGN1c3RvbWVycyBzd2l0Y2ggdG8gbmV3ZXIgcHJvZHVjdHMiLCJkZWNsaW5lIl0sWyJBIG5ldyBnYWRnZXQgaGFzIGp1c3QgYmVlbiBsYXVuY2hlZCBhbmQgaGFzIGZldyBidXllcnMgc28gZmFyIiwiaW50cm9kdWN0aW9uIl0sWyJQcm9maXRzIGNsaW1iIGFzIHNhbGVzIGdyb3cgYW5kIHRoZSBjb3N0IHBlciB1bml0IGZhbGxzIiwiZ3Jvd3RoIl0sWyJSaXZhbHMgY3V0IHByaWNlcyB0byBob2xkIG1hcmtldCBzaGFyZSBmb3IgYSB3ZWxsLWtub3duIHNvZnQgZHJpbmsiLCJtYXR1cml0eSJdLFsiRFZEIHBsYXllcnMgYXJlIGJlaW5nIHJlcGxhY2VkIGJ5IHN0cmVhbWluZyBzZXJ2aWNlcyIsImRlY2xpbmUiXSxbIlRoZSBidXNpbmVzcyBtYXkgd2l0aGRyYXcgdGhlIHByb2R1Y3Qgb3IgZmluZCBhIG5ldyB1c2UgZm9yIGl0IiwiZGVjbGluZSJdLFsiVGhlIHByb2R1Y3QgaXMgd2VsbCBrbm93biBhbmQgc2FsZXMgYXJlIHN0ZWFkeSwgc28gdGhlIGZvY3VzIGlzIG9uIGtlZXBpbmcgbG95YWwgY3VzdG9tZXJzIiwibWF0dXJpdHkiXV0=");
const FINANCE: [string, string][] = unpack("W1siQSBiYW5rIG92ZXJkcmFmdCIsInNob3J0LXRlcm0gZmluYW5jZSJdLFsiVHJhZGUgY3JlZGl0IGZyb20gc3VwcGxpZXJzIiwic2hvcnQtdGVybSBmaW5hbmNlIl0sWyJBIDEwLXllYXIgYmFuayBsb2FuIiwibG9uZy10ZXJtIGZpbmFuY2UiXSxbIklzc3VpbmcgbmV3IHNoYXJlcyIsImxvbmctdGVybSBmaW5hbmNlIl0sWyJSZXRhaW5lZCBwcm9maXQiLCJsb25nLXRlcm0gZmluYW5jZSJdLFsiQSBjcmVkaXQgY2FyZCIsInNob3J0LXRlcm0gZmluYW5jZSJdLFsiQSBtb3J0Z2FnZSBvbiBhIGZhY3RvcnkiLCJsb25nLXRlcm0gZmluYW5jZSJdLFsiRGViZW50dXJlcyIsImxvbmctdGVybSBmaW5hbmNlIl0sWyJEZWxheWluZyBwYXltZW50IHRvIGEgc3VwcGxpZXIgZm9yIDMwIGRheXMiLCJzaG9ydC10ZXJtIGZpbmFuY2UiXSxbIkEgNjAtZGF5IGJhbmsgYmlsbCIsInNob3J0LXRlcm0gZmluYW5jZSJdXQ==");
const MARKET: [string, string, string][] = unpack("W1siSW5jb21lcyByaXNlIGFuZCB0aGUgZ29vZCBpcyBhIG5vcm1hbCBnb29kIiwiZGVtYW5kIGluY3JlYXNlcyIsIkNvbnN1bWVycyBjYW4gYWZmb3JkIG1vcmUgb2YgYSBub3JtYWwgZ29vZCB3aGVuIHRoZWlyIGluY29tZXMgcmlzZSwgc28gZGVtYW5kIGluY3JlYXNlcy4iXSxbIkEgbmV3IHRlY2hub2xvZ3kgY3V0cyB0aGUgY29zdCBvZiBwcm9kdWNpbmcgYSBnb29kIiwic3VwcGx5IGluY3JlYXNlcyIsIkxvd2VyIHByb2R1Y3Rpb24gY29zdHMgbWFrZSBpdCBwcm9maXRhYmxlIHRvIHN1cHBseSBtb3JlIGF0IGV2ZXJ5IHByaWNlLCBzbyBzdXBwbHkgaW5jcmVhc2VzLiJdLFsiVGhlIHByaWNlIG9mIGEgc3Vic3RpdHV0ZSBnb29kIGZhbGxzIiwiZGVtYW5kIGRlY3JlYXNlcyIsIkNvbnN1bWVycyBzd2l0Y2ggdG8gdGhlIGNoZWFwZXIgc3Vic3RpdHV0ZSwgc28gZGVtYW5kIGZvciB0aGlzIGdvb2QgZGVjcmVhc2VzLiJdLFsiVGhlIHByaWNlIG9mIGEgY29tcGxlbWVudCBnb29kIGZhbGxzIiwiZGVtYW5kIGluY3JlYXNlcyIsIkEgY29tcGxlbWVudCBpcyB1c2VkIHRvZ2V0aGVyIHdpdGggdGhpcyBnb29kLCBzbyB3aGVuIGl0IGdldHMgY2hlYXBlciBwZW9wbGUgYnV5IG1vcmUgb2YgYm90aCBhbmQgZGVtYW5kIGluY3JlYXNlcy4iXSxbIkEgZHJvdWdodCBkZXN0cm95cyBtdWNoIG9mIHRoZSB3aGVhdCBjcm9wIiwic3VwcGx5IGRlY3JlYXNlcyIsIkxlc3Mgd2hlYXQgY2FuIGJlIHByb2R1Y2VkLCBzbyBzdXBwbHkgZGVjcmVhc2VzLiJdLFsiQ29uc3VtZXIgdGFzdGVzIHNoaWZ0IGF3YXkgZnJvbSBhIHByb2R1Y3QiLCJkZW1hbmQgZGVjcmVhc2VzIiwiRmV3ZXIgcGVvcGxlIHdhbnQgdGhlIHByb2R1Y3QgYXQgZXZlcnkgcHJpY2UsIHNvIGRlbWFuZCBkZWNyZWFzZXMuIl0sWyJUaGUgZ292ZXJubWVudCBwYXlzIHByb2R1Y2VycyBhIHN1YnNpZHkiLCJzdXBwbHkgaW5jcmVhc2VzIiwiQSBzdWJzaWR5IGxvd2VycyBwcm9kdWNlcnMnIGNvc3RzLCBzbyB0aGV5IHN1cHBseSBtb3JlIGFuZCBzdXBwbHkgaW5jcmVhc2VzLiJdLFsiQSB0YXggaXMgcGxhY2VkIG9uIHByb2R1Y2VycyBvZiBhIGdvb2QiLCJzdXBwbHkgZGVjcmVhc2VzIiwiVGhlIHRheCByYWlzZXMgcHJvZHVjZXJzJyBjb3N0cywgc28gdGhleSBzdXBwbHkgbGVzcyBhbmQgc3VwcGx5IGRlY3JlYXNlcy4iXSxbIlRoZSBwb3B1bGF0aW9uIG9mIGEgdG93biBncm93cyByYXBpZGx5IiwiZGVtYW5kIGluY3JlYXNlcyIsIlRoZXJlIGFyZSBtb3JlIGJ1eWVycyBpbiB0aGUgbWFya2V0LCBzbyBkZW1hbmQgaW5jcmVhc2VzLiJdLFsiVGhlIGNvc3Qgb2YgcmF3IG1hdGVyaWFscyByaXNlcyIsInN1cHBseSBkZWNyZWFzZXMiLCJIaWdoZXIgY29zdHMgbWFrZSBwcm9kdWN0aW9uIGxlc3MgcHJvZml0YWJsZSwgc28gc3VwcGx5IGRlY3JlYXNlcy4iXSxbIkFuIGFkdmVydGlzaW5nIGNhbXBhaWduIG1ha2VzIGEgcHJvZHVjdCBtb3JlIHBvcHVsYXIiLCJkZW1hbmQgaW5jcmVhc2VzIiwiTW9yZSBwZW9wbGUgd2FudCB0aGUgcHJvZHVjdCBhdCBldmVyeSBwcmljZSwgc28gZGVtYW5kIGluY3JlYXNlcy4iXSxbIldvcmtlcnMnIHdhZ2VzIHJpc2UsIHJhaXNpbmcgcHJvZHVjdGlvbiBjb3N0cyIsInN1cHBseSBkZWNyZWFzZXMiLCJIaWdoZXIgbGFib3VyIGNvc3RzIG1ha2UgcHJvZHVjZXJzIHN1cHBseSBsZXNzIGF0IGVhY2ggcHJpY2UsIHNvIHN1cHBseSBkZWNyZWFzZXMuIl1d");
const GENETICS: [string, string, string][] = unpack("W1siVGhlIGRpZmZlcmVudCBmb3JtcyBvZiBhIGdlbmUiLCJhbGxlbGUiLCJBbGxlbGVzIGFyZSB0aGUgYWx0ZXJuYXRpdmUgdmVyc2lvbnMgb2YgdGhlIHNhbWUgZ2VuZSwgc3VjaCBhcyBUIGFuZCB0LiJdLFsiQW4gb3JnYW5pc20ncyBnZW5ldGljIG1ha2V1cCwgc3VjaCBhcyBUdCIsImdlbm90eXBlIiwiR2Vub3R5cGUgaXMgdGhlIGNvbWJpbmF0aW9uIG9mIGFsbGVsZXMgYW4gb3JnYW5pc20gaGFzLiJdLFsiVGhlIG9ic2VydmFibGUgY2hhcmFjdGVyaXN0aWNzIG9mIGFuIG9yZ2FuaXNtIiwicGhlbm90eXBlIiwiUGhlbm90eXBlIGlzIHdoYXQgdGhlIG9yZ2FuaXNtIGxvb2tzIGxpa2Ugb3IgZG9lcywgc3VjaCBhcyBiZWluZyB0YWxsLiJdLFsiQW4gYWxsZWxlIHRoYXQgc2hvd3MgaW4gdGhlIHBoZW5vdHlwZSBldmVuIHdoZW4gb25seSBvbmUgY29weSBpcyBwcmVzZW50IiwiZG9taW5hbnQiLCJBIGRvbWluYW50IGFsbGVsZSBpcyBleHByZXNzZWQgZXZlbiB3aGVuIHBhaXJlZCB3aXRoIGEgZGlmZmVyZW50IGFsbGVsZS4iXSxbIkFuIGFsbGVsZSB0aGF0IGlzIGhpZGRlbiB3aGVuIGEgZG9taW5hbnQgYWxsZWxlIGlzIHByZXNlbnQiLCJyZWNlc3NpdmUiLCJBIHJlY2Vzc2l2ZSBhbGxlbGUgb25seSBzaG93cyB3aGVuIHRoZXJlIGFyZSB0d28gY29waWVzIG9mIGl0LiJdLFsiSGF2aW5nIHR3byBpZGVudGljYWwgYWxsZWxlcyBmb3IgYSBnZW5lIiwiaG9tb3p5Z291cyIsIkhvbW8tIG1lYW5zIHNhbWUsIHNvIFRUIGFuZCB0dCBhcmUgaG9tb3p5Z291cy4iXSxbIkhhdmluZyB0d28gZGlmZmVyZW50IGFsbGVsZXMgZm9yIGEgZ2VuZSIsImhldGVyb3p5Z291cyIsIkhldGVyby0gbWVhbnMgZGlmZmVyZW50LCBzbyBUdCBpcyBoZXRlcm96eWdvdXMuIl0sWyJBIHNlY3Rpb24gb2YgRE5BIHRoYXQgY29kZXMgZm9yIGEgcHJvdGVpbiIsImdlbmUiLCJBIGdlbmUgaXMgYSBsZW5ndGggb2YgRE5BIHRoYXQgY2FycmllcyB0aGUgaW5zdHJ1Y3Rpb25zIGZvciBvbmUgcHJvdGVpbi4iXV0=");
const DIGESTIVE: [string, string, string][] = unpack("W1siV2hpY2ggbnV0cmllbnQgaXMgYnJva2VuIGRvd24gYnkgYW15bGFzZT8iLCJzdGFyY2giLCJBbXlsYXNlIGRpZ2VzdHMgc3RhcmNoIGludG8gc2ltcGxlIHN1Z2Fycy4iXSxbIldoaWNoIG51dHJpZW50IGlzIGJyb2tlbiBkb3duIGJ5IHByb3RlYXNlPyIsInByb3RlaW5zIiwiUHJvdGVhc2VzIGRpZ2VzdCBwcm90ZWlucyBpbnRvIGFtaW5vIGFjaWRzLiJdLFsiV2hpY2ggbnV0cmllbnQgaXMgYnJva2VuIGRvd24gYnkgbGlwYXNlPyIsImZhdHMiLCJMaXBhc2UgZGlnZXN0cyBmYXRzIGludG8gZmF0dHkgYWNpZHMgYW5kIGdseWNlcm9sLiJdLFsiQmlsZSBkb2VzIG5vdCBjb250YWluIGVuenltZXMsIGJ1dCBpdCBoZWxwcyB0aGUgZGlnZXN0aW9uIG9mIHdoaWNoIG51dHJpZW50PyIsImZhdHMiLCJCaWxlIGJyZWFrcyBmYXQgaW50byB0aW55IGRyb3BsZXRzIChlbXVsc2lmaWVzIGl0KSwgZ2l2aW5nIGxpcGFzZSBhIGxhcmdlciBzdXJmYWNlIHRvIHdvcmsgb24uIl0sWyJXaGF0IGlzIHRoZSBlbmQgcHJvZHVjdCBvZiBzdGFyY2ggZGlnZXN0aW9uPyIsImdsdWNvc2UiLCJTdGFyY2ggaXMgbWFkZSBvZiBnbHVjb3NlIHVuaXRzLCBzbyBhbXlsYXNlIGJyZWFrcyBpdCBkb3duIGludG8gZ2x1Y29zZS4iXSxbIldoYXQgYXJlIHRoZSBlbmQgcHJvZHVjdHMgb2YgcHJvdGVpbiBkaWdlc3Rpb24/IiwiYW1pbm8gYWNpZHMiLCJQcm90ZWlucyBhcmUgY2hhaW5zIG9mIGFtaW5vIGFjaWRzLCBzbyB0aGV5IGFyZSBicm9rZW4gZG93biBpbnRvIGFtaW5vIGFjaWRzLiJdLFsiV2hhdCBhcmUgdGhlIGVuZCBwcm9kdWN0cyBvZiBmYXQgZGlnZXN0aW9uPyIsImZhdHR5IGFjaWRzIGFuZCBnbHljZXJvbCIsIkZhdHMgYXJlIG1hZGUgb2YgZmF0dHkgYWNpZHMgYW5kIGdseWNlcm9sLCBzbyBsaXBhc2Ugc3BsaXRzIHRoZW0gaW50byB0aGVzZS4iXV0=");
const BLOOD: [string, string, string][] = unpack("W1sicmVkIGJsb29kIGNlbGxzIiwiY2Fycnkgb3h5Z2VuIiwiUmVkIGJsb29kIGNlbGxzIGNvbnRhaW4gaGFlbW9nbG9iaW4sIHdoaWNoIGJpbmRzIG94eWdlbi4iXSxbIndoaXRlIGJsb29kIGNlbGxzIiwiZmlnaHQgaW5mZWN0aW9uIiwiV2hpdGUgYmxvb2QgY2VsbHMgZGVzdHJveSBwYXRob2dlbnMgYW5kIG1ha2UgYW50aWJvZGllcy4iXSxbInBsYXRlbGV0cyIsImhlbHAgYmxvb2QgY2xvdCIsIlBsYXRlbGV0cyBjbHVtcCB0b2dldGhlciBhdCBhIHdvdW5kIGFuZCBoZWxwIGZvcm0gYSBjbG90LiJdLFsicGxhc21hIiwiY2FycnkgZGlzc29sdmVkIHN1YnN0YW5jZXMgYW5kIGhlYXQiLCJQbGFzbWEgaXMgdGhlIGxpcXVpZCBwYXJ0IG9mIGJsb29kIHRoYXQgY2FycmllcyBudXRyaWVudHMsIHdhc3RlLCBob3Jtb25lcyBhbmQgaGVhdC4iXSxbImFydGVyaWVzIiwiY2FycnkgYmxvb2QgYXdheSBmcm9tIHRoZSBoZWFydCIsIkFydGVyaWVzIGhhdmUgdGhpY2sgd2FsbHMgdG8gY29wZSB3aXRoIHRoZSBoaWdoIHByZXNzdXJlIG9mIGJsb29kIGxlYXZpbmcgdGhlIGhlYXJ0LiJdLFsidmVpbnMiLCJjYXJyeSBibG9vZCBiYWNrIHRvIHRoZSBoZWFydCIsIlZlaW5zIGhhdmUgdmFsdmVzIGFuZCBjYXJyeSBibG9vZCBhdCBsb3cgcHJlc3N1cmUgYmFjayB0byB0aGUgaGVhcnQuIl0sWyJjYXBpbGxhcmllcyIsImV4Y2hhbmdlIG1hdGVyaWFscyB3aXRoIGJvZHkgY2VsbHMiLCJDYXBpbGxhcnkgd2FsbHMgYXJlIG9uZSBjZWxsIHRoaWNrLCBzbyBzdWJzdGFuY2VzIHBhc3MgZWFzaWx5IGJldHdlZW4gYmxvb2QgYW5kIGNlbGxzLiJdXQ==");
const MITOSIS: [string, string, string][] = unpack("W1siUHJvZHVjZXMgdHdvIGdlbmV0aWNhbGx5IGlkZW50aWNhbCBkYXVnaHRlciBjZWxscyIsIm1pdG9zaXMiLCJNaXRvc2lzIGNvcGllcyB0aGUgY2VsbCBleGFjdGx5LCBzbyB0aGUgdHdvIGRhdWdodGVyIGNlbGxzIGFyZSBpZGVudGljYWwuIl0sWyJQcm9kdWNlcyBmb3VyIGdlbmV0aWNhbGx5IGRpZmZlcmVudCBnYW1ldGVzIiwibWVpb3NpcyIsIk1laW9zaXMgbWFrZXMgZm91ciBkaWZmZXJlbnQgY2VsbHMsIHdoaWNoIGJlY29tZSBnYW1ldGVzLiJdLFsiSXMgdXNlZCBmb3IgZ3Jvd3RoIGFuZCByZXBhaXIiLCJtaXRvc2lzIiwiTWl0b3NpcyBtYWtlcyBuZXcgYm9keSBjZWxscyBmb3IgZ3Jvd3RoIGFuZCB0byByZXBsYWNlIGRhbWFnZWQgb25lcy4iXSxbIkhhbHZlcyB0aGUgY2hyb21vc29tZSBudW1iZXIiLCJtZWlvc2lzIiwiTWVpb3NpcyBtYWtlcyBoYXBsb2lkIGNlbGxzIHdpdGggaGFsZiB0aGUgY2hyb21vc29tZXMsIHNvIGZlcnRpbGlzYXRpb24gcmVzdG9yZXMgdGhlIGZ1bGwgbnVtYmVyLiJdLFsiSW52b2x2ZXMgY3Jvc3Npbmcgb3ZlciBiZXR3ZWVuIGhvbW9sb2dvdXMgY2hyb21vc29tZXMiLCJtZWlvc2lzIiwiQ3Jvc3Npbmcgb3ZlciBoYXBwZW5zIG9ubHkgaW4gbWVpb3NpcyBhbmQgbWl4ZXMgZ2VuZXMgdG8gY3JlYXRlIHZhcmlhdGlvbi4iXSxbIkRhdWdodGVyIGNlbGxzIGFyZSBkaXBsb2lkIiwibWl0b3NpcyIsIk1pdG9zaXMga2VlcHMgdGhlIGZ1bGwgY2hyb21vc29tZSBudW1iZXIsIHNvIHRoZSBkYXVnaHRlciBjZWxscyBhcmUgZGlwbG9pZC4iXSxbIk9jY3VycyBpbiB0aGUgdGVzdGVzIGFuZCBvdmFyaWVzIHRvIG1ha2UgZ2FtZXRlcyIsIm1laW9zaXMiLCJHYW1ldGVzIGFyZSBtYWRlIGJ5IG1laW9zaXMgaW4gdGhlIHJlcHJvZHVjdGl2ZSBvcmdhbnMuIl0sWyJJbnZvbHZlcyBvbmUgZGl2aXNpb24gb2YgdGhlIG51Y2xldXMiLCJtaXRvc2lzIiwiTWl0b3NpcyBoYXMgb25lIGRpdmlzaW9uOyBtZWlvc2lzIGhhcyB0d28uIl0sWyJJbnZvbHZlcyB0d28gZGl2aXNpb25zIG9mIHRoZSBudWNsZXVzIiwibWVpb3NpcyIsIk1laW9zaXMgaGFzIHR3byBkaXZpc2lvbnM7IG1pdG9zaXMgaGFzIG9uZS4iXSxbIklzIHRoZSBiYXNpcyBvZiBhc2V4dWFsIHJlcHJvZHVjdGlvbiIsIm1pdG9zaXMiLCJBc2V4dWFsIHJlcHJvZHVjdGlvbiBjb3BpZXMgY2VsbHMgYnkgbWl0b3Npcywgc28gb2Zmc3ByaW5nIGFyZSBpZGVudGljYWwgdG8gdGhlIHBhcmVudC4iXSxbIkRhdWdodGVyIGNlbGxzIGFyZSBoYXBsb2lkIiwibWVpb3NpcyIsIk1laW9zaXMgcHJvZHVjZXMgaGFwbG9pZCBjZWxscyB3aXRoIGhhbGYgdGhlIG5vcm1hbCBudW1iZXIgb2YgY2hyb21vc29tZXMuIl1d");
const LIMITING: [string, string, string][] = unpack("W1siQSBwbGFudCBpbiBhIGRhcmsgcm9vbSBpcyBnaXZlbiBwbGVudHkgb2Ygd2F0ZXIgYW5kIGNhcmJvbiBkaW94aWRlIiwibGlnaHQgaW50ZW5zaXR5IiwiUGhvdG9zeW50aGVzaXMgbmVlZHMgbGlnaHQsIGFuZCB0aGVyZSBpcyBub25lLCBzbyBsaWdodCBpbnRlbnNpdHkgaXMgbGltaXRpbmcuIl0sWyJBIHBsYW50IGluIGJyaWdodCBsaWdodCBhbmQgd2FybSBjb25kaXRpb25zIGlzIHNlYWxlZCBpbiBhIGphciB3aXRoIHZlcnkgbGl0dGxlIGFpciIsImNhcmJvbiBkaW94aWRlIGNvbmNlbnRyYXRpb24iLCJMaWdodCBhbmQgd2FybXRoIGFyZSBwbGVudGlmdWwsIHNvIHRoZSBzaG9ydGFnZSBvZiBjYXJib24gZGlveGlkZSBpcyB0aGUgbGltaXRpbmcgZmFjdG9yLiJdLFsiQSBwbGFudCBpbiBicmlnaHQgbGlnaHQgd2l0aCBwbGVudHkgb2YgY2FyYm9uIGRpb3hpZGUgaXMga2VwdCBpbiBhIGZyZWV6aW5nIGdyZWVuaG91c2UiLCJ0ZW1wZXJhdHVyZSIsIkVuenltZXMgd29yayBzbG93bHkgaW4gdGhlIGNvbGQsIHNvIHRlbXBlcmF0dXJlIGlzIGxpbWl0aW5nLiJdLFsiVGhlIHJhdGUgb2YgcGhvdG9zeW50aGVzaXMgcmlzZXMgYXMgYSBsYW1wIGlzIG1vdmVkIGNsb3NlciwgdGhlbiBzdG9wcyByaXNpbmcgZXZlbiB3aGVuIHRoZSBsYW1wIGlzIGJyb3VnaHQgY2xvc2VyIHN0aWxsIiwiY2FyYm9uIGRpb3hpZGUgY29uY2VudHJhdGlvbiIsIk9uY2UgbW9yZSBsaWdodCBubyBsb25nZXIgaGVscHMsIGFub3RoZXIgZmFjdG9yIHN1Y2ggYXMgY2FyYm9uIGRpb3hpZGUgaGFzIGJlY29tZSBsaW1pdGluZy4iXSxbIk9uIGEgaG90IGRheSB3aXRoIHBsZW50eSBvZiBsaWdodCBhbmQgY2FyYm9uIGRpb3hpZGUsIGEgcGxhbnQgd2lsdHMgYmVjYXVzZSB0aGUgc29pbCBpcyBkcnkiLCJ3YXRlciIsIldpdGhvdXQgZW5vdWdoIHdhdGVyIHRoZSBwbGFudCBjbG9zZXMgaXRzIHN0b21hdGEgYW5kIHBob3Rvc3ludGhlc2lzIHNsb3dzLCBzbyB3YXRlciBpcyBsaW1pdGluZy4iXSxbIkEgbGVhZnkgcGxhbnQgaW4gYSB3YXJtIHJvb20gd2l0aCBwbGVudHkgb2YgYWlyIGlzIHBsYWNlZCBpbiBhIHNoYWR5IGNvcm5lciIsImxpZ2h0IGludGVuc2l0eSIsIlRlbXBlcmF0dXJlIGFuZCBjYXJib24gZGlveGlkZSBhcmUgZmluZSwgc28gdGhlIGxvdyBsaWdodCBpcyBsaW1pdGluZy4iXV0=");
const INDICATORS: [string, string, string][] = unpack("W1siV2hhdCBjb2xvdXIgaXMgdW5pdmVyc2FsIGluZGljYXRvciBpbiBhIHN0cm9uZyBhY2lkIHN1Y2ggYXMgcEggMT8iLCJyZWQiLCJTdHJvbmcgYWNpZHMgdHVybiB1bml2ZXJzYWwgaW5kaWNhdG9yIHJlZC4iXSxbIldoYXQgY29sb3VyIGlzIHVuaXZlcnNhbCBpbmRpY2F0b3IgYXQgcEggND8iLCJvcmFuZ2UiLCJXZWFrIGFjaWRzIHR1cm4gdW5pdmVyc2FsIGluZGljYXRvciBvcmFuZ2Ugb3IgeWVsbG93LCBhbmQgcEggNCBpcyBvcmFuZ2UuIl0sWyJXaGF0IGNvbG91ciBpcyB1bml2ZXJzYWwgaW5kaWNhdG9yIGF0IHBIIDY/IiwieWVsbG93IiwiV2Vha2x5IGFjaWRpYyBzb2x1dGlvbnMgc3VjaCBhcyBwSCA2IGFyZSB5ZWxsb3cuIl0sWyJXaGF0IGNvbG91ciBpcyB1bml2ZXJzYWwgaW5kaWNhdG9yIGluIGEgbmV1dHJhbCBzb2x1dGlvbiAocEggNyk/IiwiZ3JlZW4iLCJVbml2ZXJzYWwgaW5kaWNhdG9yIGlzIGdyZWVuIGluIGEgbmV1dHJhbCBzb2x1dGlvbi4iXSxbIldoYXQgY29sb3VyIGlzIHVuaXZlcnNhbCBpbmRpY2F0b3IgYXQgcEggOT8iLCJibHVlIiwiV2VhayBhbGthbGlzIHN1Y2ggYXMgcEggOSB0dXJuIHVuaXZlcnNhbCBpbmRpY2F0b3IgYmx1ZS4iXSxbIldoYXQgY29sb3VyIGlzIHVuaXZlcnNhbCBpbmRpY2F0b3IgaW4gYSBzdHJvbmcgYWxrYWxpIHN1Y2ggYXMgcEggMTM/IiwicHVycGxlIiwiU3Ryb25nIGFsa2FsaXMgdHVybiB1bml2ZXJzYWwgaW5kaWNhdG9yIHB1cnBsZS4iXSxbIldoYXQgY29sb3VyIGRvZXMgYmx1ZSBsaXRtdXMgcGFwZXIgdHVybiBpbiBhbiBhY2lkPyIsInJlZCIsIkxpdG11cyB0dXJucyByZWQgaW4gYWNpZHMuIEJsdWUgbGl0bXVzIGlzIG9ubHkgY2hhbmdlZCBieSBhbiBhY2lkLiJdLFsiV2hhdCBjb2xvdXIgZG9lcyByZWQgbGl0bXVzIHBhcGVyIHR1cm4gaW4gYW4gYWxrYWxpPyIsImJsdWUiLCJMaXRtdXMgdHVybnMgYmx1ZSBpbiBhbGthbGlzLiBSZWQgbGl0bXVzIGlzIG9ubHkgY2hhbmdlZCBieSBhbiBhbGthbGkuIl0sWyJXaGF0IGNvbG91ciBpcyBwaGVub2xwaHRoYWxlaW4gaW4gYW4gYWxrYWxpPyIsInBpbmsiLCJQaGVub2xwaHRoYWxlaW4gaXMgY29sb3VybGVzcyBpbiBhY2lkcyBhbmQgcGluayBpbiBhbGthbGlzLiJdLFsiV2hhdCBjb2xvdXIgaXMgcGhlbm9scGh0aGFsZWluIGluIGFuIGFjaWQ/IiwiY29sb3VybGVzcyIsIlBoZW5vbHBodGhhbGVpbiBpcyBjb2xvdXJsZXNzIGluIGFjaWRzIGFuZCBwaW5rIGluIGFsa2FsaXMuIl1d");

// ---------- Accounting ----------

function sourceDocuments(): Topic {
  return bankMCQ(
    "source-documents",
    "Source documents",
    SOURCE_DOCS.map(([desc, doc]) => ({
      prompt: `Which source document ${desc}?`,
      answer: doc,
      explanation: `The ${doc} is the document that ${desc}. Source documents are the first evidence of a transaction and the starting point for recording it.`,
    })),
    SOURCE_DOCS.map((d) => d[1]),
  );
}

function gstCalculation(): Topic {
  return {
    id: "gst-calculation",
    label: "GST calculations",
    generate: () => {
      const kind = pick(["add", "portion", "exclusive"] as const);
      if (kind === "add") {
        const ex = randInt(1, 50) * 10;
        return {
          prompt: `An item costs ${money(ex)} excluding GST. GST is 10%. What is the price including GST?`,
          answer: money(ex * 1.1),
          explanation: `GST = 10% of ${money(ex)} = ${money(ex / 10)}. Price including GST = ${money(ex)} + ${money(ex / 10)} = ${money(ex * 1.1)}. (Or multiply by 1.1.)`,
        };
      }
      const k = randInt(1, 40);
      if (kind === "portion") {
        return {
          prompt: `An invoice total including GST is ${money(11 * k)}. How much of this is GST? (GST is 10%.)`,
          answer: money(k),
          explanation: `The total is 110% of the price before GST, so GST is 10/110 = 1/11 of the total. ${money(11 * k)} ÷ 11 = ${money(k)}.`,
        };
      }
      return {
        prompt: `An invoice total including GST is ${money(11 * k)}. What is the price excluding GST? (GST is 10%.)`,
        answer: money(10 * k),
        explanation: `The total is 110% of the price before GST, so divide by 1.1. ${money(11 * k)} ÷ 1.1 = ${money(10 * k)}. (Check: 10% of ${money(10 * k)} is ${money(k)}, and ${money(10 * k)} + ${money(k)} = ${money(11 * k)}.)`,
      };
    },
  };
}

function grossAndNetProfit(): Topic {
  return {
    id: "gross-net-profit",
    label: "Gross profit and net profit",
    generate: () => {
      const sales = randInt(20, 200) * 1000;
      const cogs = Math.round((sales * randInt(40, 70)) / 100 / 1000) * 1000;
      const gross = sales - cogs;
      const expenses = Math.round((gross * randInt(30, 70)) / 100 / 1000) * 1000;
      if (Math.random() < 0.5) {
        return {
          prompt: `A business has sales of ${money(sales)} and cost of sales of ${money(cogs)}. What is its gross profit?`,
          answer: money(gross),
          explanation: `Gross profit = sales - cost of sales = ${money(sales)} - ${money(cogs)} = ${money(gross)}.`,
        };
      }
      return {
        prompt: `A business has a gross profit of ${money(gross)} and operating expenses of ${money(expenses)}. What is its net profit?`,
        answer: money(gross - expenses),
        explanation: `Net profit = gross profit - expenses = ${money(gross)} - ${money(expenses)} = ${money(gross - expenses)}.`,
      };
    },
  };
}

function debtToEquity(): Topic {
  return {
    id: "debt-to-equity",
    label: "Debt to equity ratio",
    generate: () => {
      const equity = randInt(1, 20) * 10000;
      const ratio = pick([0.25, 0.5, 0.75, 1, 1.5, 2]);
      return {
        prompt: `A business has total liabilities of ${money(equity * ratio)} and owner's equity of ${money(equity)}. What is its debt to equity ratio?`,
        answer: String(ratio),
        explanation: `Debt to equity ratio = total liabilities / owner's equity = ${money(equity * ratio)} / ${money(equity)} = ${ratio}. A higher ratio means the business relies more on borrowed money.`,
      };
    },
  };
}

function weightedAverageCost(): Topic {
  return {
    id: "inventory-weighted-average",
    label: "Inventory: weighted average cost",
    generate: () => {
      for (;;) {
        const q1 = randInt(1, 10) * 10;
        const q2 = randInt(1, 10) * 10;
        const p1 = randInt(2, 20);
        const p2 = randInt(2, 20);
        const total = q1 * p1 + q2 * p2;
        if (p1 === p2 || total % (q1 + q2) !== 0) continue;
        const avg = total / (q1 + q2);
        return {
          prompt: `A business buys ${q1} units at $${p1} each and then ${q2} units at $${p2} each. Using the weighted average method, what is the cost per unit?`,
          answer: `$${avg}`,
          explanation: `Total cost = ${q1} × ${p1} + ${q2} × ${p2} = ${q1 * p1} + ${q2 * p2} = ${money(total)}. Total units = ${q1} + ${q2} = ${q1 + q2}. Weighted average cost = ${money(total)} / ${q1 + q2} = $${avg} per unit.`,
        };
      }
    },
  };
}

function returnOnEquity(): Topic {
  return {
    id: "return-on-equity",
    label: "Return on equity",
    generate: () => {
      const equity = randInt(5, 50) * 10000;
      const pct = randInt(4, 30);
      const profit = (equity * pct) / 100;
      return {
        prompt: `A business earns a net profit of ${money(profit)} and has owner's equity of ${money(equity)}. What is its return on equity?`,
        answer: `${pct}%`,
        explanation: `Return on equity = net profit / owner's equity × 100 = ${money(profit)} / ${money(equity)} × 100 = ${pct}%.`,
      };
    },
  };
}

function marginOfSafety(): Topic {
  return {
    id: "margin-of-safety",
    label: "Margin of safety",
    generate: () => {
      const budget = pick([200, 400, 500, 800, 1000, 2000]);
      const pct = pick([10, 20, 25, 30, 40]);
      const margin = (budget * pct) / 100;
      const breakEven = budget - margin;
      return {
        prompt: `A business expects to sell ${budget} units. Its break-even point is ${breakEven} units. What is the margin of safety as a percentage of expected sales?`,
        answer: `${pct}%`,
        explanation: `Margin of safety (units) = expected sales - break-even = ${budget} - ${breakEven} = ${margin} units. As a percentage of expected sales: ${margin} / ${budget} × 100 = ${pct}%.`,
      };
    },
  };
}

// ---------- Business Studies ----------

function productLifeCycle(): Topic {
  const note: Record<string, string> = {
    introduction: "the product has just been launched, so sales are low and promotion costs are high",
    growth: "sales and profits rise quickly as more customers buy and competitors enter",
    maturity: "sales peak and level off and competition is strong",
    decline: "sales fall as customers move to alternatives",
  };
  return bankMCQ(
    "product-life-cycle",
    "Product life cycle",
    LIFE_CYCLE.map(([x, stage]) => ({
      prompt: `Which stage of the product life cycle is described? "${x}"`,
      answer: stage,
      explanation: `This is the ${stage} stage: ${note[stage]}.`,
    })),
    ["introduction", "growth", "maturity", "decline"],
  );
}

function financeSources(): Topic {
  const note: Record<string, string> = {
    "short-term finance": "it is repaid within about a year and pays for day-to-day needs",
    "long-term finance": "it is repaid over more than a year (or never) and pays for major assets and expansion",
  };
  return bankMCQ(
    "finance-sources",
    "Sources of finance",
    FINANCE.map(([x, term]) => ({
      prompt: `Is "${x}" usually a source of short-term or long-term finance?`,
      answer: term,
      explanation: `${x} is ${term}: ${note[term]}.`,
    })),
    ["short-term finance", "long-term finance"],
  );
}

function revenueAndProfit(): Topic {
  return {
    id: "revenue-profit",
    label: "Revenue and profit",
    generate: () => {
      const price = randInt(5, 50);
      const qty = randInt(2, 40) * 50;
      const revenue = price * qty;
      const profit = randInt(1, Math.floor(revenue / 200)) * 100;
      const costs = revenue - profit;
      if (Math.random() < 0.5) {
        return {
          prompt: `A business sells ${qty} units at $${price} each. What is its total revenue?`,
          answer: money(revenue),
          explanation: `Revenue = price × quantity = $${price} × ${qty} = ${money(revenue)}.`,
        };
      }
      return {
        prompt: `A business sells ${qty} units at $${price} each. Its total costs are ${money(costs)}. What is its profit?`,
        answer: money(profit),
        explanation: `Revenue = $${price} × ${qty} = ${money(revenue)}. Profit = revenue - costs = ${money(revenue)} - ${money(costs)} = ${money(profit)}.`,
      };
    },
  };
}

function netProfitMargin(): Topic {
  return {
    id: "net-profit-margin",
    label: "Net profit margin",
    generate: () => {
      const revenue = randInt(5, 100) * 10000;
      const pct = pick([5, 8, 10, 12, 15, 20, 25]);
      const profit = (revenue * pct) / 100;
      return {
        prompt: `A business has revenue of ${money(revenue)} and a net profit of ${money(profit)}. What is its net profit margin?`,
        answer: `${pct}%`,
        explanation: `Net profit margin = net profit / revenue × 100 = ${money(profit)} / ${money(revenue)} × 100 = ${pct}%.`,
      };
    },
  };
}

function absenteeismRate(): Topic {
  return {
    id: "absenteeism-rate",
    label: "Absenteeism rate",
    generate: () => {
      let staff = 20;
      let days = 20;
      let pct = 1;
      let lost = 0;
      do {
        staff = pick([20, 50, 100]);
        days = pick([20, 25]);
        pct = pick([1, 2, 4, 5]);
        lost = (staff * days * pct) / 100;
      } while (!Number.isInteger(lost));
      const totalDays = staff * days;
      return {
        prompt: `A business has ${staff} employees, each expected to work ${days} days this month. ${lost} working days were lost to absence. What is the absenteeism rate?`,
        answer: `${pct}%`,
        explanation: `Total days that should be worked = ${staff} × ${days} = ${totalDays}. Absenteeism rate = days lost / total days × 100 = ${lost} / ${totalDays} × 100 = ${pct}%.`,
      };
    },
  };
}

function capacityUtilisation(): Topic {
  return {
    id: "capacity-utilisation",
    label: "Capacity utilisation",
    generate: () => {
      const capacity = pick([1000, 2000, 4000, 5000]);
      const pct = pick([50, 60, 70, 75, 80, 90]);
      const output = (capacity * pct) / 100;
      return {
        prompt: `A factory can produce ${capacity} units a month but actually produces ${output}. What is its capacity utilisation?`,
        answer: `${pct}%`,
        explanation: `Capacity utilisation = actual output / maximum capacity × 100 = ${output} / ${capacity} × 100 = ${pct}%.`,
      };
    },
  };
}

// ---------- Economics ----------

function marketChanges(): Topic {
  return bankMCQ(
    "market-changes",
    "Changes in demand and supply",
    MARKET.map(([scenario, effect, why]) => ({
      prompt: `What is the most likely effect on the market for this good? "${scenario}"`,
      answer: effect,
      explanation: why,
    })),
    ["demand increases", "demand decreases", "supply increases", "supply decreases"],
  );
}

function gdpPerCapita(): Topic {
  return {
    id: "gdp-per-capita",
    label: "GDP per capita",
    generate: () => {
      const people = pick([5, 10, 20, 25, 50]);
      const perCapita = pick([20000, 25000, 30000, 35000, 40000, 55000, 60000, 80000]);
      const gdp = (perCapita * people) / 1000;
      return {
        prompt: `A country has a GDP of ${money(gdp)} billion and a population of ${people} million. What is its GDP per capita?`,
        answer: money(perCapita),
        explanation: `GDP per capita = GDP / population. ${money(gdp)} billion = ${money(gdp * 1000)} million, so ${money(gdp * 1000)} million / ${people} million = ${money(perCapita)} per person.`,
      };
    },
  };
}

function gdpExpenditure(): Topic {
  return {
    id: "gdp-expenditure",
    label: "GDP: the expenditure approach",
    generate: () => {
      const c = randInt(40, 120) * 10;
      const i = randInt(10, 40) * 10;
      const g = randInt(10, 40) * 10;
      const x = randInt(10, 40) * 10;
      const m = randInt(10, 40) * 10;
      return {
        prompt: `Consumption is ${money(c)} billion, investment ${money(i)} billion, government spending ${money(g)} billion, exports ${money(x)} billion and imports ${money(m)} billion. Calculate GDP.`,
        answer: `${money(c + i + g + x - m)} billion`,
        explanation: `GDP = C + I + G + (X - M). Net exports X - M = ${x} - ${m} = ${x - m}. So GDP = ${c} + ${i} + ${g} + (${x - m}) = ${money(c + i + g + x - m)} billion.`,
      };
    },
  };
}

function realWage(): Topic {
  return {
    id: "real-wage",
    label: "Real wages",
    generate: () => {
      const cpi = pick([110, 120, 125, 140, 150, 200]);
      const real = randInt(20, 75) * 20;
      const nominal = (real * cpi) / 100;
      return {
        prompt: `A worker earns $${nominal} a week. The consumer price index is ${cpi} (base year = 100). What is the real wage in base-year dollars?`,
        answer: `$${real}`,
        explanation: `Real wage = nominal wage / CPI × 100 = ${nominal} / ${cpi} × 100 = $${real}. Prices have risen, so the same pay buys less than it did in the base year.`,
      };
    },
  };
}

function budgetBalance(): Topic {
  return {
    id: "budget-balance",
    label: "Government budget balance",
    generate: () => {
      const revenue = randInt(10, 60) * 10;
      const spending = randInt(10, 60) * 10;
      if (revenue === spending) return budgetBalance().generate();
      const gap = Math.abs(revenue - spending);
      const surplus = revenue > spending;
      const answer = `${surplus ? "surplus" : "deficit"} of $${gap} billion`;
      return {
        prompt: `A government collects $${revenue} billion in revenue and spends $${spending} billion. What is the budget outcome?`,
        answer,
        options: shuffle([answer, `${surplus ? "deficit" : "surplus"} of $${gap} billion`, "balanced budget", `${surplus ? "surplus" : "deficit"} of $${revenue + spending} billion`]),
        explanation: `Compare revenue with spending: $${revenue} billion - $${spending} billion = ${revenue - spending}. ${surplus ? "Revenue is greater than spending, so there is a surplus" : "Spending is greater than revenue, so there is a deficit"} of $${gap} billion.`,
      };
    },
  };
}

// ---------- Biology ----------

function bioBank(id: string, label: string, items: [string, string, string][], pool: string[], prompt: (x: string) => string): Topic {
  return bankMCQ(
    id,
    label,
    items.map(([x, answer, explanation]) => ({ prompt: prompt(x), answer, explanation })),
    pool,
  );
}

function geneticsTerms(): Topic {
  return bioBank(
    "genetics-terms",
    "Genetics vocabulary",
    GENETICS,
    GENETICS.map((g) => g[1]),
    (x) => `Which term matches this description? "${x}"`,
  );
}

function digestion(): Topic {
  return bankMCQ(
    "digestion",
    "Digestion and enzymes",
    DIGESTIVE.map(([prompt, answer, explanation]) => ({ prompt, answer, explanation })),
    ["starch", "proteins", "fats", "glucose", "amino acids", "fatty acids and glycerol"],
  );
}

function bloodAndVessels(): Topic {
  return bioBank(
    "blood-vessels",
    "Blood and blood vessels",
    BLOOD,
    BLOOD.map((b) => b[1]),
    (x) => `What is the main function of ${x}?`,
  );
}

function mitosisMeiosis(): Topic {
  return bioBank("mitosis-meiosis", "Mitosis and meiosis", MITOSIS, ["mitosis", "meiosis"], (x) => `Does this describe mitosis or meiosis? "${x}"`);
}

function limitingFactors(): Topic {
  return bioBank(
    "limiting-factors",
    "Limiting factors in photosynthesis",
    LIMITING,
    ["light intensity", "carbon dioxide concentration", "temperature", "water"],
    (x) => `Which factor is most likely limiting the rate of photosynthesis? ${x}.`,
  );
}

function markRecapture(): Topic {
  return {
    id: "mark-recapture",
    label: "Estimating population size",
    generate: () => {
      const marked = pick([20, 30, 40, 50, 60]);
      const recapturedMarked = pick([2, 4, 5, 10]);
      const second = recapturedMarked * randInt(2, 10);
      const estimate = (marked * second) / recapturedMarked;
      return {
        prompt: `${marked} animals are caught, marked and released. Later ${second} animals are caught and ${recapturedMarked} of them are marked. Estimate the population size.`,
        answer: String(estimate),
        explanation: `Estimated population = (number marked × number in second catch) / number of marked animals recaptured = ${marked} × ${second} / ${recapturedMarked} = ${marked * second} / ${recapturedMarked} = ${estimate}.`,
      };
    },
  };
}

function populationDensity(): Topic {
  return {
    id: "population-density",
    label: "Population density",
    generate: () => {
      const area = pick([2, 5, 10, 20, 50]);
      const density = pick([3, 5, 8, 12, 15, 24]);
      return {
        prompt: `${density * area} kangaroos live in a reserve of ${area} km². What is the population density in kangaroos per km²?`,
        answer: `${density} per km²`,
        explanation: `Population density = number of organisms / area = ${density * area} / ${area} = ${density} per km².`,
      };
    },
  };
}

// ---------- Chemistry ----------

const CHEM_ELEMENTS = [
  "hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon",
  "sodium", "magnesium", "aluminium", "silicon", "phosphorus", "sulfur", "chlorine", "argon", "potassium", "calcium",
];

function shellConfig(z: number): number[] {
  const config: number[] = [];
  let left = z;
  for (const cap of [2, 8, 8, 2]) {
    if (left <= 0) break;
    const n = Math.min(cap, left);
    config.push(n);
    left -= n;
  }
  return config;
}

function electronConfiguration(): Topic {
  return {
    id: "electron-configuration",
    label: "Electron configuration",
    generate: () => {
      const z = randInt(3, 20);
      const answer = shellConfig(z).join(", ");
      const wrong = [z - 2, z - 1, z + 1, z + 2]
        .filter((n) => n >= 1 && n <= 20 && n !== z)
        .map((n) => shellConfig(n).join(", "))
        .filter((c) => c !== answer);
      const config = shellConfig(z);
      return {
        prompt: `What is the electron configuration of ${CHEM_ELEMENTS[z - 1]} (atomic number ${z})?`,
        answer,
        options: shuffle([answer, ...Array.from(new Set(wrong)).slice(0, 3)]),
        explanation: `A neutral atom has ${z} electrons. Fill the shells in order: the first holds up to 2, the second up to 8 and the third up to 8 (for these elements). ${config.map((n, i) => `shell ${i + 1} gets ${n}`).join(", ")}, so the configuration is ${answer}.`,
      };
    },
  };
}

const REACTIVITY = ["potassium", "sodium", "calcium", "magnesium", "aluminium", "zinc", "iron", "lead", "copper", "silver", "gold"];

function reactivitySeries(): Topic {
  return {
    id: "reactivity-series",
    label: "The reactivity series",
    generate: () => {
      const [a, b] = pickDistinct(REACTIVITY, 2);
      const winner = REACTIVITY.indexOf(a) < REACTIVITY.indexOf(b) ? a : b;
      const loser = winner === a ? b : a;
      return {
        prompt: `Which metal is more reactive: ${a} or ${b}?`,
        answer: winner,
        options: [a, b],
        explanation: `In the reactivity series ${winner} is above ${loser}, so it is more reactive. From most to least reactive: ${REACTIVITY.join(", ")}.`,
      };
    },
  };
}

function indicatorColours(): Topic {
  return bioBank(
    "indicator-colours",
    "Indicators and colours",
    INDICATORS.map(([q, a, e]) => [q, a, e] as [string, string, string]),
    ["red", "orange", "yellow", "green", "blue", "purple", "pink", "colourless"],
    (x) => x,
  );
}

function percentageYield(): Topic {
  return {
    id: "percentage-yield",
    label: "Percentage yield",
    generate: () => {
      const theoretical = randInt(2, 10) * 10;
      const pct = pick([40, 50, 60, 70, 80, 90]);
      const actual = (theoretical * pct) / 100;
      return {
        prompt: `A reaction should produce ${theoretical} g of product, but only ${actual} g is collected. What is the percentage yield?`,
        answer: `${pct}%`,
        explanation: `Percentage yield = actual yield / theoretical yield × 100 = ${actual} / ${theoretical} × 100 = ${pct}%.`,
      };
    },
  };
}

function molarGasVolume(): Topic {
  return {
    id: "molar-gas-volume",
    label: "Gas volumes at STP",
    generate: () => {
      const n = pick([0.25, 0.5, 1, 2, 3, 4, 5]);
      const volume = round(22.4 * n, 1);
      if (Math.random() < 0.5) {
        return {
          prompt: `What volume does ${n} mol of any gas occupy at standard temperature and pressure? (1 mol occupies 22.4 L.)`,
          answer: `${volume} L`,
          explanation: `Volume = moles × molar volume = ${n} × 22.4 = ${volume} L.`,
        };
      }
      return {
        prompt: `How many moles of gas are in ${volume} L at standard temperature and pressure? (1 mol occupies 22.4 L.)`,
        answer: String(n),
        explanation: `Moles = volume / molar volume = ${volume} / 22.4 = ${n} mol.`,
      };
    },
  };
}

function reactionRate(): Topic {
  return {
    id: "reaction-rate",
    label: "Rate of reaction",
    generate: () => {
      const time = pick([10, 20, 30, 40, 50, 60]);
      const rate = randInt(2, 9);
      const amount = rate * time;
      return {
        prompt: `A reaction produces ${amount} cm³ of gas in ${time} s. What is the average rate of reaction in cm³/s?`,
        answer: `${rate} cm³/s`,
        explanation: `Average rate = amount of product / time = ${amount} / ${time} = ${rate} cm³/s.`,
      };
    },
  };
}

function titration(): Topic {
  return {
    id: "titration",
    label: "Titration calculations",
    generate: () => {
      for (;;) {
        const c1 = pick([0.1, 0.2, 0.5, 1]);
        const v1 = pick([10, 20, 25, 30, 40, 50]);
        const v2 = pick([10, 20, 25, 50]);
        const c2 = round((c1 * v1) / v2, 4);
        if (v1 === v2 || Math.round(c2 * 1000) / 1000 !== c2) continue;
        return {
          prompt: `${v1} mL of ${c1} mol/L hydrochloric acid exactly neutralises ${v2} mL of sodium hydroxide solution (HCl + NaOH -> NaCl + H2O). What is the concentration of the sodium hydroxide in mol/L?`,
          answer: String(c2),
          explanation: `The acid and base react 1 : 1, so moles of acid = moles of base. Moles of HCl = ${c1} × ${v1 / 1000} L = ${round((c1 * v1) / 1000, 5)} mol. Concentration of NaOH = ${round((c1 * v1) / 1000, 5)} mol / ${v2 / 1000} L = ${c2} mol/L. (Shortcut: c1V1 = c2V2.)`,
        };
      }
    },
  };
}

// ---------- Physics ----------

function weightAndMass(): Topic {
  return {
    id: "weight-mass",
    label: "Weight and mass",
    generate: () => {
      const m = randInt(1, 90);
      if (Math.random() < 0.5) {
        return {
          prompt: `What is the weight of a ${m} kg object? (g = 10 N/kg)`,
          answer: `${m * 10} N`,
          explanation: `Weight = mass × gravitational field strength (W = mg) = ${m} × 10 = ${m * 10} N.`,
        };
      }
      return {
        prompt: `An object weighs ${m * 10} N. What is its mass? (g = 10 N/kg)`,
        answer: `${m} kg`,
        explanation: `Rearrange W = mg to m = W / g = ${m * 10} / 10 = ${m} kg.`,
      };
    },
  };
}

function efficiency(): Topic {
  return {
    id: "efficiency",
    label: "Efficiency",
    generate: () => {
      const input = pick([100, 200, 400, 500, 800, 1000]);
      const eff = pick([20, 25, 40, 50, 60, 75, 80]);
      const output = (input * eff) / 100;
      return {
        prompt: `A machine takes in ${input} J of energy and gives out ${output} J of useful energy. What is its efficiency?`,
        answer: `${eff}%`,
        explanation: `Efficiency = useful energy out / total energy in × 100 = ${output} / ${input} × 100 = ${eff}%. The other ${input - output} J is wasted, mostly as heat.`,
      };
    },
  };
}

function chargeAndCurrent(): Topic {
  return {
    id: "charge-current",
    label: "Charge and current",
    generate: () => {
      const i = randInt(1, 10);
      const t = randInt(2, 30);
      if (Math.random() < 0.5) {
        return {
          prompt: `A current of ${i} A flows for ${t} s. How much charge flows?`,
          answer: `${i * t} C`,
          explanation: `Charge = current × time (Q = It) = ${i} × ${t} = ${i * t} C.`,
        };
      }
      return {
        prompt: `A charge of ${i * t} C flows past a point in ${t} s. What is the current?`,
        answer: `${i} A`,
        explanation: `Rearrange Q = It to I = Q / t = ${i * t} / ${t} = ${i} A.`,
      };
    },
  };
}

function electricityCost(): Topic {
  return {
    id: "electricity-cost",
    label: "Cost of electricity",
    generate: () => {
      const kw = pick([1, 2, 3, 5]);
      const hours = randInt(2, 10);
      const price = pick([20, 25, 30, 35, 40]);
      return {
        prompt: `A ${kw} kW heater runs for ${hours} hours. Electricity costs ${price} cents per kWh. What is the cost in cents?`,
        answer: `${kw * hours * price} cents`,
        explanation: `Energy used = power × time = ${kw} kW × ${hours} h = ${kw * hours} kWh. Cost = ${kw * hours} × ${price} = ${kw * hours * price} cents.`,
      };
    },
  };
}

function hookesLaw(): Topic {
  return {
    id: "hookes-law",
    label: "Springs and Hooke's law",
    generate: () => {
      const k = pick([20, 40, 60, 80, 100, 200]);
      const x = pick([0.1, 0.2, 0.25, 0.5]);
      const force = round(k * x);
      if (Math.random() < 0.5) {
        return {
          prompt: `A spring has a spring constant of ${k} N/m. What force stretches it by ${x} m?`,
          answer: `${force} N`,
          explanation: `Hooke's law: F = kx = ${k} × ${x} = ${force} N.`,
        };
      }
      return {
        prompt: `A force of ${force} N stretches a spring with a spring constant of ${k} N/m. What is the extension?`,
        answer: `${x} m`,
        explanation: `Rearrange F = kx to x = F / k = ${force} / ${k} = ${x} m.`,
      };
    },
  };
}

function transformers(): Topic {
  return {
    id: "transformers",
    label: "Transformers",
    generate: () => {
      const np = pick([100, 200, 500, 1000]);
      const k = pick([2, 3, 5, 10]);
      if (Math.random() < 0.5) {
        const vp = pick([6, 12, 20, 24, 50]);
        return {
          prompt: `A transformer has ${np} turns on the primary coil and ${np * k} turns on the secondary coil. The primary voltage is ${vp} V. What is the secondary voltage?`,
          answer: `${vp * k} V`,
          explanation: `For a transformer Vp / Vs = Np / Ns. The secondary has ${k} times as many turns, so the voltage is ${k} times bigger: ${vp} × ${k} = ${vp * k} V. (A step-up transformer.)`,
        };
      }
      const vs = pick([6, 9, 12, 20]);
      return {
        prompt: `A transformer has ${np * k} turns on the primary coil and ${np} turns on the secondary coil. The primary voltage is ${vs * k} V. What is the secondary voltage?`,
        answer: `${vs} V`,
        explanation: `For a transformer Vp / Vs = Np / Ns. The secondary has ${k} times fewer turns, so the voltage is ${k} times smaller: ${vs * k} ÷ ${k} = ${vs} V. (A step-down transformer.)`,
      };
    },
  };
}

function freeFallSpeed(): Topic {
  return {
    id: "free-fall-speed",
    label: "Speed after falling",
    generate: () => {
      const [h, v] = pick([
        [5, 10],
        [20, 20],
        [45, 30],
        [80, 40],
        [125, 50],
        [180, 60],
      ] as [number, number][]);
      return {
        prompt: `An object is dropped from rest from a height of ${h} m. Ignoring air resistance and taking g = 10 m/s², what is its speed just before it hits the ground?`,
        answer: `${v} m/s`,
        explanation: `Energy is conserved, so mgh = 1/2 mv², which gives v = √(2gh) = √(2 × 10 × ${h}) = √${20 * h} = ${v} m/s.`,
      };
    },
  };
}

function specificHeatPhysics(): Topic {
  return {
    id: "specific-heat-physics",
    label: "Specific heat capacity",
    generate: () => {
      const [material, c] = pick([
        ["water", 4200],
        ["aluminium", 900],
        ["oil", 2100],
        ["copper", 400],
      ] as [string, number][]);
      const m = pick([0.5, 1, 2, 5]);
      const dt = pick([5, 10, 20]);
      const q = m * c * dt;
      return {
        prompt: `How much energy is needed to raise the temperature of ${m} kg of ${material} by ${dt} °C? (Specific heat capacity of ${material} = ${c} J/kg/°C.)`,
        answer: `${q} J`,
        explanation: `Energy = mass × specific heat capacity × temperature change = ${m} × ${c} × ${dt} = ${q} J.`,
      };
    },
  };
}

// ---------- Bands ----------

export function moreAccountingTopics(grade: number): Topic[] {
  return grade <= 10 ? [sourceDocuments(), gstCalculation(), grossAndNetProfit()] : [debtToEquity(), weightedAverageCost(), returnOnEquity(), marginOfSafety()];
}

export function moreBusinessTopics(grade: number): Topic[] {
  return grade <= 10 ? [productLifeCycle(), financeSources(), revenueAndProfit()] : [netProfitMargin(), absenteeismRate(), capacityUtilisation()];
}

export function moreEconomicsTopics(grade: number): Topic[] {
  return grade <= 10 ? [marketChanges(), gdpPerCapita()] : [gdpExpenditure(), realWage(), budgetBalance()];
}

export function moreBiologyTopics(grade: number): Topic[] {
  return grade <= 10 ? [geneticsTerms(), digestion(), bloodAndVessels()] : [mitosisMeiosis(), limitingFactors(), markRecapture(), populationDensity()];
}

export function moreChemistryTopics(grade: number): Topic[] {
  return grade <= 10 ? [electronConfiguration(), reactivitySeries(), indicatorColours()] : [percentageYield(), molarGasVolume(), reactionRate(), titration()];
}

export function morePhysicsTopics(grade: number): Topic[] {
  return grade <= 10 ? [weightAndMass(), efficiency(), chargeAndCurrent(), electricityCost()] : [hookesLaw(), transformers(), freeFallSpeed(), specificHeatPhysics()];
}
