import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";
import { moreBiologyTopics } from "./electivesMore";
import { biologyWordProblems } from "./wordProblemsMore";

const ORGANELLES: [string, string][] = unpack("W1siY29udHJvbHMgdGhlIGNlbGwncyBhY3Rpdml0aWVzIGFuZCBjb250YWlucyBpdHMgRE5BIiwibnVjbGV1cyJdLFsicmVsZWFzZXMgZW5lcmd5IGZyb20gZ2x1Y29zZSBkdXJpbmcgcmVzcGlyYXRpb24iLCJtaXRvY2hvbmRyaWEiXSxbImFic29yYnMgbGlnaHQgZW5lcmd5IGZvciBwaG90b3N5bnRoZXNpcyIsImNobG9yb3BsYXN0Il0sWyJjb250cm9scyB3aGF0IGVudGVycyBhbmQgbGVhdmVzIHRoZSBjZWxsIiwiY2VsbCBtZW1icmFuZSJdLFsibWFrZXMgcHJvdGVpbnMiLCJyaWJvc29tZSJdLFsiZ2l2ZXMgcGxhbnQgY2VsbHMgYSByaWdpZCwgc3VwcG9ydGl2ZSBzaGFwZSIsImNlbGwgd2FsbCJdLFsic3RvcmVzIHdhdGVyIGFuZCBkaXNzb2x2ZWQgc3Vic3RhbmNlcyBpbiBwbGFudCBjZWxscyIsInZhY3VvbGUiXSxbImNvbnRhaW5zIHRoZSBncmVlbiBwaWdtZW50IGNobG9yb3BoeWxsIiwiY2hsb3JvcGxhc3QiXSxbImlzIHRoZSBzaXRlIHdoZXJlIG1vc3Qgb2YgdGhlIGNlbGwncyBBVFAgaXMgbWFkZSIsIm1pdG9jaG9uZHJpYSJdLFsiaXMgYSBwYXJ0aWFsbHkgcGVybWVhYmxlIGJhcnJpZXIgYXJvdW5kIHRoZSBjeXRvcGxhc20iLCJjZWxsIG1lbWJyYW5lIl0sWyJzdG9yZXMgZ2VuZXRpYyBpbmZvcm1hdGlvbiBhcyBjaHJvbW9zb21lcyBtYWRlIG9mIEROQSIsIm51Y2xldXMiXSxbImJyZWFrcyBkb3duIHdhc3RlIG1hdGVyaWFscyBhbmQgd29ybi1vdXQgcGFydHMgb2YgdGhlIGNlbGwiLCJseXNvc29tZSJdLFsibW9kaWZpZXMsIHBhY2thZ2VzIGFuZCB0cmFuc3BvcnRzIHByb3RlaW5zIG1hZGUgYnkgdGhlIHJpYm9zb21lcyIsIkdvbGdpIGFwcGFyYXR1cyJdLFsiaXMgYSBuZXR3b3JrIG9mIG1lbWJyYW5lcyB3aGVyZSBwcm90ZWlucyBhcmUgbWFkZSBhbmQgdHJhbnNwb3J0ZWQiLCJlbmRvcGxhc21pYyByZXRpY3VsdW0iXSxbImNvbnRhaW5zIGEgbnVjbGVvbHVzLCB3aGljaCBtYWtlcyByaWJvc29tZXMiLCJudWNsZXVzIl0sWyJpcyBvZnRlbiBjYWxsZWQgdGhlIHBvd2VyaG91c2Ugb2YgdGhlIGNlbGwiLCJtaXRvY2hvbmRyaWEiXSxbImNvbnRyb2xzIHdoaWNoIHN1YnN0YW5jZXMgcGFzcyBiZXR3ZWVuIHRoZSBudWNsZXVzIGFuZCB0aGUgY3l0b3BsYXNtIiwibnVjbGVhciBtZW1icmFuZSJdLFsiaXMgZm9sZGVkIGludG8gY3Jpc3RhZSwgd2hpY2ggaW5jcmVhc2UgdGhlIHN1cmZhY2UgYXJlYSBmb3IgcmVzcGlyYXRpb24iLCJtaXRvY2hvbmRyaWEiXSxbImNvbnRhaW5zIGNobG9yb3BoeWxsIGFycmFuZ2VkIGluIHN0YWNrcyBjYWxsZWQgZ3JhbmEiLCJjaGxvcm9wbGFzdCJdLFsiZGlnZXN0cyB1bndhbnRlZCBtYXRlcmlhbCB1c2luZyBlbnp5bWVzLCBlc3BlY2lhbGx5IGluIHdoaXRlIGJsb29kIGNlbGxzIiwibHlzb3NvbWUiXV0=");
const LEVELS: [string, string][] = unpack("W1siQSBncm91cCBvZiBzaW1pbGFyIGNlbGxzIHdvcmtpbmcgdG9nZXRoZXIiLCJ0aXNzdWUiXSxbIkEgZ3JvdXAgb2YgZGlmZmVyZW50IHRpc3N1ZXMgd29ya2luZyB0b2dldGhlciIsIm9yZ2FuIl0sWyJBIGdyb3VwIG9mIG9yZ2FucyB3b3JraW5nIHRvZ2V0aGVyIiwib3JnYW4gc3lzdGVtIl0sWyJUaGUgYmFzaWMgdW5pdCBvZiBsaWZlIiwiY2VsbCJdLFsiVGhlIHN0b21hY2giLCJvcmdhbiJdLFsiWHlsZW0gaW4gYSBwbGFudCBzdGVtIiwidGlzc3VlIl0sWyJUaGUgZGlnZXN0aXZlIHN5c3RlbSIsIm9yZ2FuIHN5c3RlbSJdLFsiQSBzaW5nbGUgbGl2aW5nIGluZGl2aWR1YWwgbWFkZSBvZiBvcmdhbiBzeXN0ZW1zIiwib3JnYW5pc20iXSxbIkEgcmVkIGJsb29kIGNlbGwiLCJjZWxsIl0sWyJUaGUgaGVhcnQiLCJvcmdhbiJdLFsiQSBuZXJ2ZSBjZWxsIiwiY2VsbCJdLFsiTXVzY2xlIHRpc3N1ZSBpbiB0aGUgYXJtIiwidGlzc3VlIl0sWyJUaGUgbHVuZ3MiLCJvcmdhbiJdLFsiVGhlIGNpcmN1bGF0b3J5IHN5c3RlbSIsIm9yZ2FuIHN5c3RlbSJdLFsiQSB3aG9sZSBwbGFudCBtYWRlIG9mIG1hbnkgb3JnYW4gc3lzdGVtcyIsIm9yZ2FuaXNtIl0sWyJBIGdyb3VwIG9mIHJvb3QgY2VsbHMgYWJzb3JiaW5nIHdhdGVyIiwidGlzc3VlIl0sWyJUaGUgYnJhaW4iLCJvcmdhbiJdLFsiVGhlIG5lcnZvdXMgc3lzdGVtIiwib3JnYW4gc3lzdGVtIl0sWyJBIHNpbmdsZSBiYWN0ZXJpdW0iLCJvcmdhbmlzbSJdLFsiQSB3aGl0ZSBibG9vZCBjZWxsIiwiY2VsbCJdXQ==");
const SYSTEMS: [string, string][] = unpack("W1sidHJhbnNwb3J0cyBibG9vZCwgbnV0cmllbnRzIGFuZCBveHlnZW4gYXJvdW5kIHRoZSBib2R5IiwiY2lyY3VsYXRvcnkiXSxbImJyZWFrcyBkb3duIGZvb2QgYW5kIGFic29yYnMgbnV0cmllbnRzIiwiZGlnZXN0aXZlIl0sWyJleGNoYW5nZXMgb3h5Z2VuIGFuZCBjYXJib24gZGlveGlkZSB3aXRoIHRoZSBhaXIiLCJyZXNwaXJhdG9yeSJdLFsidXNlcyBlbGVjdHJpY2FsIHNpZ25hbHMgdG8gY29vcmRpbmF0ZSB0aGUgYm9keSIsIm5lcnZvdXMiXSxbInN1cHBvcnRzIHRoZSBib2R5IGFuZCBwcm90ZWN0cyBvcmdhbnMiLCJza2VsZXRhbCJdLFsicmVtb3ZlcyB3YXN0ZSBmcm9tIHRoZSBibG9vZCBhcyB1cmluZSIsImV4Y3JldG9yeSJdLFsiaW5jbHVkZXMgdGhlIGhlYXJ0IGFuZCBibG9vZCB2ZXNzZWxzIiwiY2lyY3VsYXRvcnkiXSxbImluY2x1ZGVzIHRoZSBsdW5ncyBhbmQgdHJhY2hlYSIsInJlc3BpcmF0b3J5Il0sWyJpbmNsdWRlcyB0aGUgYnJhaW4gYW5kIHNwaW5hbCBjb3JkIiwibmVydm91cyJdLFsiaW5jbHVkZXMgdGhlIHN0b21hY2gsIGludGVzdGluZXMgYW5kIGxpdmVyIiwiZGlnZXN0aXZlIl0sWyJpbmNsdWRlcyBib25lcywgam9pbnRzIGFuZCBjYXJ0aWxhZ2UiLCJza2VsZXRhbCJdLFsiaW5jbHVkZXMgdGhlIGtpZG5leXMgYW5kIGJsYWRkZXIiLCJleGNyZXRvcnkiXSxbInB1bXBzIGJsb29kIHVzaW5nIHRoZSBoZWFydCIsImNpcmN1bGF0b3J5Il0sWyJjYXJyaWVzIG1lc3NhZ2VzIHVzaW5nIG5lcnZlcyIsIm5lcnZvdXMiXSxbImJyZWFrcyBkb3duIGZvb2QgdXNpbmcgZW56eW1lcyIsImRpZ2VzdGl2ZSJdLFsiYWxsb3dzIGdhcyBleGNoYW5nZSBpbiB0aGUgYWx2ZW9saSBvZiB0aGUgbHVuZ3MiLCJyZXNwaXJhdG9yeSJdLFsicHJvdGVjdHMgaW50ZXJuYWwgb3JnYW5zIGFuZCBhbGxvd3MgbW92ZW1lbnQiLCJza2VsZXRhbCJdLFsiZmlsdGVycyB1cmVhIGFuZCBleGNlc3Mgd2F0ZXIgZnJvbSB0aGUgYmxvb2QiLCJleGNyZXRvcnkiXSxbImNhcnJpZXMgb3h5Z2VuIHRvIGJvZHkgY2VsbHMgaW4gcmVkIGJsb29kIGNlbGxzIiwiY2lyY3VsYXRvcnkiXSxbImNvbnRyb2xzIHJlZmxleCBhY3Rpb25zIHZpYSB0aGUgc3BpbmFsIGNvcmQiLCJuZXJ2b3VzIl1d");
const EQUATION_FACTS: [string, string][] = unpack("W1siUGhvdG9zeW50aGVzaXM6IGNhcmJvbiBkaW94aWRlICsgX19fIC0+IGdsdWNvc2UgKyBveHlnZW4iLCJ3YXRlciJdLFsiUmVzcGlyYXRpb246IGdsdWNvc2UgKyBfX18gLT4gY2FyYm9uIGRpb3hpZGUgKyB3YXRlciArIGVuZXJneSIsIm94eWdlbiJdLFsiUGxhbnRzIG5lZWQgX19fIGVuZXJneSBmb3IgcGhvdG9zeW50aGVzaXMuIiwibGlnaHQiXSxbIlBsYW50cyByZWxlYXNlIF9fXyBhcyBhIHByb2R1Y3Qgb2YgcGhvdG9zeW50aGVzaXMuIiwib3h5Z2VuIl0sWyJQbGFudHMgdGFrZSBpbiBfX18gZ2FzIGZyb20gdGhlIGFpciBmb3IgcGhvdG9zeW50aGVzaXMuIiwiY2FyYm9uIGRpb3hpZGUiXSxbIlRoZSBzdWdhciBtYWRlIGJ5IHBob3Rvc3ludGhlc2lzIGlzIF9fXy4iLCJnbHVjb3NlIl0sWyJBZXJvYmljIHJlc3BpcmF0aW9uIHJlbGVhc2VzIGNhcmJvbiBkaW94aWRlIGFuZCBfX18gYXMgd2FzdGUgcHJvZHVjdHMuIiwid2F0ZXIiXSxbIlBob3Rvc3ludGhlc2lzOiBfX18gKyB3YXRlciAtPiBnbHVjb3NlICsgb3h5Z2VuIiwiY2FyYm9uIGRpb3hpZGUiXSxbIkFlcm9iaWMgcmVzcGlyYXRpb246IGdsdWNvc2UgKyBveHlnZW4gLT4gY2FyYm9uIGRpb3hpZGUgKyBfX18gKyBlbmVyZ3kiLCJ3YXRlciJdLFsiUGhvdG9zeW50aGVzaXMgdHJhcHMgX19fIGVuZXJneSBhbmQgY29udmVydHMgaXQgaW50byBjaGVtaWNhbCBlbmVyZ3kgc3RvcmVkIGluIGdsdWNvc2UuIiwibGlnaHQiXSxbIlRoZSBnYXMgdXNlZCBieSBwbGFudHMgZm9yIHBob3Rvc3ludGhlc2lzIGlzIF9fXy4iLCJjYXJib24gZGlveGlkZSJdLFsiUmVzcGlyYXRpb24gcmVsZWFzZXMgdGhlIGVuZXJneSBzdG9yZWQgaW4gX19fIG1vbGVjdWxlcy4iLCJnbHVjb3NlIl0sWyJXaXRob3V0IF9fXywgYSBwbGFudCBjYW5ub3QgY2Fycnkgb3V0IHBob3Rvc3ludGhlc2lzLCBldmVuIGlmIG90aGVyIGNvbmRpdGlvbnMgYXJlIGlkZWFsLiIsImxpZ2h0Il0sWyJQaG90b3N5bnRoZXNpczogNkNPMiArIDZIMk8gLT4gQzZIMTJPNiArIDZfX18iLCJveHlnZW4iXSxbIlJlc3BpcmF0aW9uOiBDNkgxMk82ICsgNk8yIC0+IDZDTzIgKyA2X19fICsgZW5lcmd5Iiwid2F0ZXIiXSxbIlBsYW50cyBzdG9yZSBleHRyYSBfX18gdGhleSBtYWtlIGFzIHN0YXJjaCBmb3IgbGF0ZXIgdXNlLiIsImdsdWNvc2UiXSxbIl9fXyBpcyBhYnNvcmJlZCB0aHJvdWdoIHBsYW50IHJvb3RzIGFuZCB1c2VkIGluIHBob3Rvc3ludGhlc2lzLiIsIndhdGVyIl0sWyJUaGUgd2FzdGUgZ2FzIHJlbGVhc2VkIGJ5IHJlc3BpcmF0aW9uIGlzIF9fXy4iLCJjYXJib24gZGlveGlkZSJdLFsiUGhvdG9zeW50aGVzaXMgb25seSBoYXBwZW5zIHdoZW4gdGhlcmUgaXMgZW5vdWdoIF9fXyBhdmFpbGFibGUsIGFtb25nIG90aGVyIGZhY3RvcnMuIiwibGlnaHQiXSxbIkNobG9yb3BoeWxsIGFic29yYnMgX19fIGVuZXJneSBmb3IgdXNlIGluIHBob3Rvc3ludGhlc2lzLiIsImxpZ2h0Il1d");
const DNA_PROCESSES: [string, string][] = unpack("W1siQ29weWluZyBhIEROQSBtb2xlY3VsZSBiZWZvcmUgYSBjZWxsIGRpdmlkZXMiLCJyZXBsaWNhdGlvbiJdLFsiTWFraW5nIGFuIG1STkEgY29weSBvZiBhIGdlbmUiLCJ0cmFuc2NyaXB0aW9uIl0sWyJCdWlsZGluZyBhIHByb3RlaW4gZnJvbSB0aGUgY29kb25zIGluIG1STkEiLCJ0cmFuc2xhdGlvbiJdLFsiQSBwZXJtYW5lbnQgY2hhbmdlIGluIHRoZSBETkEgYmFzZSBzZXF1ZW5jZSIsIm11dGF0aW9uIl0sWyJPY2N1cnMgaW4gdGhlIG51Y2xldXMgYW5kIHByb2R1Y2VzIG1STkEiLCJ0cmFuc2NyaXB0aW9uIl0sWyJPY2N1cnMgYXQgdGhlIHJpYm9zb21lIiwidHJhbnNsYXRpb24iXSxbIkVuc3VyZXMgZWFjaCBuZXcgY2VsbCByZWNlaXZlcyBhIGZ1bGwgY29weSBvZiB0aGUgRE5BIiwicmVwbGljYXRpb24iXSxbIkNhbiBiZSBjYXVzZWQgYnkgcmFkaWF0aW9uIG9yIGNoZW1pY2FscyBhbmQgbWF5IGFsdGVyIGEgcHJvdGVpbiIsIm11dGF0aW9uIl0sWyJIYXBwZW5zIGJlZm9yZSBtaXRvc2lzIHNvIGVhY2ggZGF1Z2h0ZXIgY2VsbCBnZXRzIGEgZnVsbCBzZXQgb2YgY2hyb21vc29tZXMiLCJyZXBsaWNhdGlvbiJdLFsiVXNlcyBSTkEgcG9seW1lcmFzZSB0byBidWlsZCBhbiBtUk5BIHN0cmFuZCBmcm9tIGEgRE5BIHRlbXBsYXRlIiwidHJhbnNjcmlwdGlvbiJdLFsiVXNlcyB0Uk5BIG1vbGVjdWxlcyB0byBicmluZyBhbWlubyBhY2lkcyB0byB0aGUgcmlib3NvbWUiLCJ0cmFuc2xhdGlvbiJdLFsiQSBjaGFuZ2UgaW4gYSBzaW5nbGUgRE5BIGJhc2UgdGhhdCBtYXkgb3IgbWF5IG5vdCBhZmZlY3QgdGhlIHByb3RlaW4gbWFkZSIsIm11dGF0aW9uIl0sWyJQcm9kdWNlcyB0d28gaWRlbnRpY2FsIEROQSBtb2xlY3VsZXMgZnJvbSBvbmUgb3JpZ2luYWwiLCJyZXBsaWNhdGlvbiJdLFsiVGFrZXMgcGxhY2UgaW4gdGhlIG51Y2xldXMgYmVmb3JlIHRoZSBtUk5BIGxlYXZlcyBmb3IgdGhlIGN5dG9wbGFzbSIsInRyYW5zY3JpcHRpb24iXSxbIkpvaW5zIGFtaW5vIGFjaWRzIHRvZ2V0aGVyIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgYnkgbVJOQSBjb2RvbnMiLCJ0cmFuc2xhdGlvbiJdLFsiQ2FuIG9jY3VyIG5hdHVyYWxseSBvciBiZSBjYXVzZWQgYnkgbXV0YWdlbnMgc3VjaCBhcyBVViBsaWdodCIsIm11dGF0aW9uIl0sWyJVc2VzIEROQSBwb2x5bWVyYXNlIHRvIGNvcHkgZWFjaCBzdHJhbmQgb2YgdGhlIGRvdWJsZSBoZWxpeCIsInJlcGxpY2F0aW9uIl0sWyJDb252ZXJ0cyBhIGdlbmUncyBiYXNlIHNlcXVlbmNlIGludG8gYSBjb21wbGVtZW50YXJ5IFJOQSBzZXF1ZW5jZSIsInRyYW5zY3JpcHRpb24iXSxbIkVuZHMgd2hlbiBhIHN0b3AgY29kb24gaXMgcmVhY2hlZCBvbiB0aGUgbVJOQSIsInRyYW5zbGF0aW9uIl0sWyJNYXkgYmUgc2lsZW50LCBoYXJtZnVsIG9yIG9jY2FzaW9uYWxseSBiZW5lZmljaWFsIHRvIHRoZSBvcmdhbmlzbSIsIm11dGF0aW9uIl1d");
const NATURAL_SELECTION: [string, string][] = unpack("W1siZGVzY3JpYmVzIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGluZGl2aWR1YWxzIGluIGEgcG9wdWxhdGlvbiIsInZhcmlhdGlvbiJdLFsiaXMgdGhlIHByb2Nlc3Mgd2hlcmUgaW5kaXZpZHVhbHMgd2l0aCBoZWxwZnVsIHRyYWl0cyBzdXJ2aXZlIGFuZCByZXByb2R1Y2UgbW9yZSIsIm5hdHVyYWwgc2VsZWN0aW9uIl0sWyJpcyB0aGUgcGFzc2luZyBvZiB0cmFpdHMgZnJvbSBwYXJlbnRzIHRvIG9mZnNwcmluZyIsImluaGVyaXRhbmNlIl0sWyJpcyB3aGVuIGEgc3BlY2llcyBwcm9kdWNlcyBtb3JlIG9mZnNwcmluZyB0aGFuIHRoZSBlbnZpcm9ubWVudCBjYW4gc3VwcG9ydCIsIm92ZXJwcm9kdWN0aW9uIl0sWyJpcyB0aGUgZ3JhZHVhbCBjaGFuZ2UgaW4gdGhlIGluaGVyaXRlZCB0cmFpdHMgb2YgYSBwb3B1bGF0aW9uIG92ZXIgZ2VuZXJhdGlvbnMiLCJldm9sdXRpb24iXSxbImlzIHRoZSBmb3JtYXRpb24gb2YgbmV3IHNwZWNpZXMgZnJvbSBwb3B1bGF0aW9ucyB0aGF0IGNhbiBubyBsb25nZXIgaW50ZXJicmVlZCIsInNwZWNpYXRpb24iXSxbImRlc2NyaWJlcyB3aHkgbm8gdHdvIHNpYmxpbmdzIChleGNlcHQgaWRlbnRpY2FsIHR3aW5zKSBsb29rIGV4YWN0bHkgYWxpa2UiLCJ2YXJpYXRpb24iXSxbImV4cGxhaW5zIGhvdyBnaXJhZmZlcyB3aXRoIGxvbmdlciBuZWNrcyBiZWNhbWUgbW9yZSBjb21tb24gb3ZlciB0aW1lIiwibmF0dXJhbCBzZWxlY3Rpb24iXSxbImlzIHdoeSBjaGlsZHJlbiBvZnRlbiByZXNlbWJsZSB0aGVpciBwYXJlbnRzIiwiaW5oZXJpdGFuY2UiXSxbImV4cGxhaW5zIHdoeSBhIHNpbmdsZSBwYWlyIG9mIHJhYmJpdHMgY2FuIGxlYWQgdG8gdGhvdXNhbmRzIG9mIHJhYmJpdHMgaWYgbm9uZSBkaWUiLCJvdmVycHJvZHVjdGlvbiJdLFsiZGVzY3JpYmVzIGhvdyBhbnRpYmlvdGljIHJlc2lzdGFuY2UgaGFzIGluY3JlYXNlZCBpbiBiYWN0ZXJpYSBvdmVyIG1hbnkgZ2VuZXJhdGlvbnMiLCJldm9sdXRpb24iXSxbImV4cGxhaW5zIHdoeSBEYXJ3aW4ncyBmaW5jaGVzIG9uIGRpZmZlcmVudCBpc2xhbmRzIGJlY2FtZSBzZXBhcmF0ZSBzcGVjaWVzIiwic3BlY2lhdGlvbiJdLFsiYXJpc2VzIGZyb20gbXV0YXRpb25zIGFuZCBmcm9tIHNleHVhbCByZXByb2R1Y3Rpb24gbWl4aW5nIGdlbmVzIiwidmFyaWF0aW9uIl0sWyJtZWFucyBpbmRpdmlkdWFscyBiZXN0IHN1aXRlZCB0byB0aGVpciBlbnZpcm9ubWVudCBhcmUgbW9yZSBsaWtlbHkgdG8gc3Vydml2ZSBhbmQgcmVwcm9kdWNlIiwibmF0dXJhbCBzZWxlY3Rpb24iXSxbImlzIHBhc3NlZCBvbiB0aHJvdWdoIGdlbmVzIGNhcnJpZWQgaW4gZWdncyBhbmQgc3Blcm0iLCJpbmhlcml0YW5jZSJdLFsibWVhbnMgbW9yZSBvZmZzcHJpbmcgYXJlIHByb2R1Y2VkIHRoYW4gdGhlIGVudmlyb25tZW50IGNhbiBzdXBwb3J0LCBjcmVhdGluZyBjb21wZXRpdGlvbiIsIm92ZXJwcm9kdWN0aW9uIl0sWyJpcyB0aGUgY3VtdWxhdGl2ZSBnZW5ldGljIGNoYW5nZSBpbiBhIHBvcHVsYXRpb24gYWNyb3NzIG1hbnkgZ2VuZXJhdGlvbnMiLCJldm9sdXRpb24iXSxbIm9jY3VycyB3aGVuIHR3byBwb3B1bGF0aW9ucyBiZWNvbWUgdG9vIGRpZmZlcmVudCB0byBpbnRlcmJyZWVkLCBldmVuIGlmIHJldW5pdGVkIiwic3BlY2lhdGlvbiJdLFsiaXMgdGhlIHJhdyBtYXRlcmlhbCB0aGF0IG5hdHVyYWwgc2VsZWN0aW9uIGFjdHMgdXBvbiIsInZhcmlhdGlvbiJdLFsiZGVzY3JpYmVzIHRoZSBzdXJ2aXZhbCBvZiB0aGUgaW5kaXZpZHVhbHMgYmVzdCBhZGFwdGVkIHRvIHRoZWlyIGVudmlyb25tZW50IiwibmF0dXJhbCBzZWxlY3Rpb24iXV0=");
const FEEDBACK: [string, string][] = unpack("W1siQm9keSB0ZW1wZXJhdHVyZSByaXNlcyBhbmQgc3dlYXRpbmcgY29vbHMgdGhlIGJvZHkgYmFjayB0byBub3JtYWwiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiSW5zdWxpbiByZWxlYXNlIGxvd2VycyBhIGhpZ2ggYmxvb2QgZ2x1Y29zZSBsZXZlbCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJPeHl0b2NpbiByZWxlYXNlIGR1cmluZyBjaGlsZGJpcnRoIHN0cmVuZ3RoZW5zIGNvbnRyYWN0aW9ucywgY2F1c2luZyBtb3JlIG94eXRvY2luIHJlbGVhc2UiLCJwb3NpdGl2ZSBmZWVkYmFjayJdLFsiUGxhdGVsZXRzIHJlbGVhc2UgY2hlbWljYWxzIHRoYXQgYXR0cmFjdCBtb3JlIHBsYXRlbGV0cyB0byBhIHdvdW5kIiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIlNoaXZlcmluZyB3aGVuIGJvZHkgdGVtcGVyYXR1cmUgZmFsbHMiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiR2x1Y2Fnb24gcmVsZWFzZSByYWlzZXMgYSBsb3cgYmxvb2QgZ2x1Y29zZSBsZXZlbCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJBIHJpcGVuaW5nIGZydWl0IHJlbGVhc2VzIGV0aHlsZW5lLCB3aGljaCBzcGVlZHMgdXAgdGhlIHJpcGVuaW5nIG9mIG5lYXJieSBmcnVpdCIsInBvc2l0aXZlIGZlZWRiYWNrIl0sWyJTd2VhdGluZyBpbmNyZWFzZXMgYXMgYm9keSB0ZW1wZXJhdHVyZSByaXNlcywgY29vbGluZyB0aGUgYm9keSBkb3duIGFnYWluIiwibmVnYXRpdmUgZmVlZGJhY2siXSxbIkJsb29kIHZlc3NlbHMgaW4gdGhlIHNraW4gd2lkZW4gKHZhc29kaWxhdGlvbikgd2hlbiB0aGUgYm9keSBpcyB0b28gaG90LCB0byBsb3NlIGhlYXQiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiQmxvb2QgdmVzc2VscyBpbiB0aGUgc2tpbiBuYXJyb3cgKHZhc29jb25zdHJpY3Rpb24pIHdoZW4gdGhlIGJvZHkgaXMgY29sZCwgdG8gY29uc2VydmUgaGVhdCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJBIGJhYnkncyBzdWNrbGluZyBzdGltdWxhdGVzIG1vcmUgbWlsay1wcm9kdWNpbmcgaG9ybW9uZSByZWxlYXNlLCBpbmNyZWFzaW5nIG1pbGsgc3VwcGx5IiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIlV0ZXJpbmUgY29udHJhY3Rpb25zIGR1cmluZyBsYWJvdXIgYXJlIHN0cmVuZ3RoZW5lZCBieSBhIGhvcm1vbmUgcmVsZWFzZWQgYmVjYXVzZSBvZiB0aGUgY29udHJhY3Rpb25zIiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIkFESCByZWxlYXNlIGluY3JlYXNlcyB3aGVuIGJsb29kIGlzIHRvbyBjb25jZW50cmF0ZWQsIHNvIHRoZSBraWRuZXlzIHJlYWJzb3JiIG1vcmUgd2F0ZXIgYW5kIGRpbHV0ZSBpdCIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJCbG9vZCBjbG90dGluZyBpcyByZWluZm9yY2VkIGFzIGFjdGl2YXRlZCBwbGF0ZWxldHMgcmVsZWFzZSBjaGVtaWNhbHMgdGhhdCBhY3RpdmF0ZSBldmVuIG1vcmUgcGxhdGVsZXRzIiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIkJyZWF0aGluZyByYXRlIGluY3JlYXNlcyB3aGVuIGNhcmJvbiBkaW94aWRlIGxldmVscyByaXNlLCByZW1vdmluZyB0aGUgZXhjZXNzIGFuZCByZXN0b3Jpbmcgbm9ybWFsIGxldmVscyIsIm5lZ2F0aXZlIGZlZWRiYWNrIl0sWyJQYW5pYyB0cmlnZ2VycyBhIHN0cmVzcyBob3Jtb25lIHRoYXQgZnVydGhlciBpbmNyZWFzZXMgaGVhcnQgcmF0ZSBhbmQgcGFuaWMgaW4gYSBzbm93YmFsbGluZyBjeWNsZSIsInBvc2l0aXZlIGZlZWRiYWNrIl0sWyJJbnN1bGluIHJlbGVhc2VkIGFmdGVyIGEgbWVhbCBsb3dlcnMgYmxvb2QgZ2x1Y29zZSBiYWNrIHRvd2FyZHMgYSBzdGFibGUgbGV2ZWwiLCJuZWdhdGl2ZSBmZWVkYmFjayJdLFsiQW4gaW5pdGlhbCBzbWFsbCBkaXN0dXJiYW5jZSBpcyBhbXBsaWZpZWQgZnVydGhlciBhbmQgZnVydGhlciBhd2F5IGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IiwicG9zaXRpdmUgZmVlZGJhY2siXSxbIk1vc3QgaG9tZW9zdGF0aWMgbWVjaGFuaXNtcyBpbiB0aGUgYm9keSB3b3JrIHRoaXMgd2F5LCBrZWVwaW5nIGNvbmRpdGlvbnMgc3RhYmxlIiwibmVnYXRpdmUgZmVlZGJhY2siXSxbIkZydWl0IHJpcGVuaW5nIHNwZWVkcyB1cCBhcyBhIHJpcGVuaW5nIGZydWl0IHJlbGVhc2VzIGEgZ2FzIHRoYXQgdHJpZ2dlcnMgZXZlbiBtb3JlIHJpcGVuaW5nIG5lYXJieSIsInBvc2l0aXZlIGZlZWRiYWNrIl1d");
const ENZYMES: [string, string][] = unpack("W1sidGhlIHRlbXBlcmF0dXJlIHJpc2VzIHdlbGwgYWJvdmUgdGhlIGVuenltZSdzIG9wdGltdW0iLCJkZWNyZWFzZXMiXSxbInRoZSB0ZW1wZXJhdHVyZSBpbmNyZWFzZXMgZnJvbSBhIGxvdyB2YWx1ZSB0b3dhcmRzIHRoZSBvcHRpbXVtIiwiaW5jcmVhc2VzIl0sWyJ0aGUgcEggbW92ZXMgZmFyIGF3YXkgZnJvbSB0aGUgZW56eW1lJ3Mgb3B0aW11bSBwSCIsImRlY3JlYXNlcyJdLFsidGhlIHN1YnN0cmF0ZSBjb25jZW50cmF0aW9uIGluY3JlYXNlcyBmcm9tIGEgbG93IGxldmVsIiwiaW5jcmVhc2VzIl0sWyJhbGwgYWN0aXZlIHNpdGVzIGFyZSBhbHJlYWR5IG9jY3VwaWVkIGFuZCBtb3JlIHN1YnN0cmF0ZSBpcyBhZGRlZCIsInN0YXlzIHRoZSBzYW1lIl0sWyJ0aGUgZW56eW1lIGlzIGRlbmF0dXJlZCIsImRlY3JlYXNlcyJdLFsidGhlIGVuenltZSBjb25jZW50cmF0aW9uIGluY3JlYXNlcyBhbmQgdGhlcmUgaXMgcGxlbnR5IG9mIHN1YnN0cmF0ZSIsImluY3JlYXNlcyJdLFsidGhlIHRlbXBlcmF0dXJlIGZhbGxzIHdlbGwgYmVsb3cgdGhlIGVuenltZSdzIG9wdGltdW0iLCJkZWNyZWFzZXMiXSxbInRoZSBwSCBpcyBhbHJlYWR5IGF0IHRoZSBlbnp5bWUncyBvcHRpbXVtIGFuZCB0ZW1wZXJhdHVyZSByaXNlcyBzbGlnaHRseSB0b3dhcmRzIHRoZSBvcHRpbXVtIiwiaW5jcmVhc2VzIl0sWyJtb3JlIGVuenltZSBpcyBhZGRlZCB3aGlsZSBzdWJzdHJhdGUgcmVtYWlucyBpbiBzaG9ydCwgZnVsbHkgdXNlZCBzdXBwbHkiLCJzdGF5cyB0aGUgc2FtZSJdLFsidGhlIGVuenltZSBpcyBib2lsZWQiLCJkZWNyZWFzZXMiXSxbInN1YnN0cmF0ZSBjb25jZW50cmF0aW9uIGtlZXBzIGluY3JlYXNpbmcgYWZ0ZXIgYWxsIGFjdGl2ZSBzaXRlcyBhcmUgYWxyZWFkeSBmdWxsIiwic3RheXMgdGhlIHNhbWUiXSxbImEgY29tcGV0aXRpdmUgaW5oaWJpdG9yIGlzIGFkZGVkIHRoYXQgYmxvY2tzIHNvbWUgYWN0aXZlIHNpdGVzIiwiZGVjcmVhc2VzIl0sWyJ0ZW1wZXJhdHVyZSBhbmQgcEggYXJlIGJvdGggYXQgdGhlIGVuenltZSdzIG9wdGltdW0gYW5kIG1vcmUgZW56eW1lIGlzIGFkZGVkIHdpdGggcGxlbnR5IG9mIHN1YnN0cmF0ZSIsImluY3JlYXNlcyJdLFsidGhlIHBIIHJldHVybnMgZnJvbSBhbiBleHRyZW1lIHZhbHVlIGJhY2sgdG93YXJkcyB0aGUgZW56eW1lJ3Mgb3B0aW11bSIsImluY3JlYXNlcyJdLFsiYW4gaXJyZXZlcnNpYmxlIGluaGliaXRvciBwZXJtYW5lbnRseSBiaW5kcyB0byB0aGUgYWN0aXZlIHNpdGUiLCJkZWNyZWFzZXMiXSxbInRoZSBlbnp5bWUgaGFzIGFscmVhZHkgZGVuYXR1cmVkIGFuZCBpcyBoZWF0ZWQgZnVydGhlciIsInN0YXlzIHRoZSBzYW1lIl0sWyJzdWJzdHJhdGUgY29uY2VudHJhdGlvbiBpbmNyZWFzZXMgd2hpbGUgdGhlcmUgaXMgc3RpbGwgdW51c2VkIGVuenltZSBhdmFpbGFibGUiLCJpbmNyZWFzZXMiXSxbInRoZSB0ZW1wZXJhdHVyZSBpcyBsb3dlcmVkIHRvd2FyZHMgZnJlZXppbmciLCJkZWNyZWFzZXMiXSxbImEgbm9uLWNvbXBldGl0aXZlIGluaGliaXRvciBjaGFuZ2VzIHRoZSBzaGFwZSBvZiB0aGUgYWN0aXZlIHNpdGUiLCJkZWNyZWFzZXMiXV0=");
const CELL_LOCATIONS: [string, string][] = unpack("W1siR2x5Y29seXNpcyIsImN5dG9wbGFzbSJdLFsiVGhlIEtyZWJzIGN5Y2xlIiwibWl0b2Nob25kcmlhbCBtYXRyaXgiXSxbIlRoZSBlbGVjdHJvbiB0cmFuc3BvcnQgY2hhaW4gaW4gcmVzcGlyYXRpb24iLCJpbm5lciBtaXRvY2hvbmRyaWFsIG1lbWJyYW5lIl0sWyJUaGUgbGlnaHQtZGVwZW5kZW50IHJlYWN0aW9ucyBvZiBwaG90b3N5bnRoZXNpcyIsInRoeWxha29pZCBtZW1icmFuZXMiXSxbIlRoZSBDYWx2aW4gY3ljbGUiLCJzdHJvbWEiXSxbIkFuYWVyb2JpYyBmZXJtZW50YXRpb24iLCJjeXRvcGxhc20iXSxbIlRoZSBsaW5rIHJlYWN0aW9uIChweXJ1dmF0ZSBveGlkYXRpb24pIiwibWl0b2Nob25kcmlhbCBtYXRyaXgiXSxbIk94aWRhdGl2ZSBwaG9zcGhvcnlsYXRpb24iLCJpbm5lciBtaXRvY2hvbmRyaWFsIG1lbWJyYW5lIl0sWyJUaGUgZml4YXRpb24gb2YgY2FyYm9uIGRpb3hpZGUgaW50byBzdWdhcnMiLCJzdHJvbWEiXSxbIlRoZSBzcGxpdHRpbmcgb2Ygd2F0ZXIgZHVyaW5nIHBob3Rvc3ludGhlc2lzIChwaG90b2x5c2lzKSIsInRoeWxha29pZCBtZW1icmFuZXMiXSxbIlRoZSBmaXJzdCBzdGFnZSBvZiByZXNwaXJhdGlvbiwgYnJlYWtpbmcgZ2x1Y29zZSBpbnRvIHB5cnV2YXRlIiwiY3l0b3BsYXNtIl0sWyJUaGUgc2l0ZSBvZiBBVFAgc3ludGhhc2UsIHdoaWNoIHByb2R1Y2VzIG1vc3Qgb2YgdGhlIGNlbGwncyBBVFAiLCJpbm5lciBtaXRvY2hvbmRyaWFsIG1lbWJyYW5lIl0sWyJXaGVyZSBjaGxvcm9waHlsbCBjYXB0dXJlcyBsaWdodCBlbmVyZ3kiLCJ0aHlsYWtvaWQgbWVtYnJhbmVzIl0sWyJUaGUgY29udmVyc2lvbiBvZiBjYXJib24gZGlveGlkZSBpbnRvIGdsdWNvc2UgdXNpbmcgQVRQIGFuZCBOQURQSCIsInN0cm9tYSJdLFsiTGFjdGljIGFjaWQgZmVybWVudGF0aW9uIGluIG11c2NsZSBjZWxscyIsImN5dG9wbGFzbSJdLFsiV2hlcmUgdGhlIGVuenltZXMgb2YgdGhlIEtyZWJzIGN5Y2xlIGFyZSBkaXNzb2x2ZWQgaW4gdGhlIGZsdWlkIiwibWl0b2Nob25kcmlhbCBtYXRyaXgiXSxbIkFsY29ob2xpYyBmZXJtZW50YXRpb24gaW4geWVhc3QiLCJjeXRvcGxhc20iXSxbIldoZXJlIE5BREggYW5kIEZBREgyIGFyZSBwcm9kdWNlZCBmcm9tIHRoZSBLcmVicyBjeWNsZSIsIm1pdG9jaG9uZHJpYWwgbWF0cml4Il0sWyJXaGVyZSBlbGVjdHJvbnMgcGFzcyBhbG9uZyBhIGNoYWluIG9mIHByb3RlaW5zIHRvIGdlbmVyYXRlIGEgcHJvdG9uIGdyYWRpZW50IiwiaW5uZXIgbWl0b2Nob25kcmlhbCBtZW1icmFuZSJdLFsiV2hlcmUgdGhlIGZsdWlkIHN1cnJvdW5kaW5nIHRoZSB0aHlsYWtvaWRzIGlzIGZvdW5kIGluIHRoZSBjaGxvcm9wbGFzdCIsInN0cm9tYSJdXQ==");
const CHARACTERISTICS: [string, string][] = unpack("W1siaXMgdGhlIGFiaWxpdHkgdG8gZGV0ZWN0IGFuZCByZXNwb25kIHRvIGNoYW5nZXMgaW4gdGhlIHN1cnJvdW5kaW5ncyIsInNlbnNpdGl2aXR5Il0sWyJpcyB0aGUgcmVtb3ZhbCBvZiB3YXN0ZSBwcm9kdWN0cyBvZiBtZXRhYm9saXNtIiwiZXhjcmV0aW9uIl0sWyJpcyBhIHBlcm1hbmVudCBpbmNyZWFzZSBpbiBzaXplIGFuZCBtYXNzIiwiZ3Jvd3RoIl0sWyJpcyB0aGUgcHJvZHVjdGlvbiBvZiBvZmZzcHJpbmciLCJyZXByb2R1Y3Rpb24iXSxbImlzIHRoZSB0YWtpbmcgaW4gb2YgbWF0ZXJpYWxzIGZvciBlbmVyZ3kgYW5kIGdyb3d0aCIsIm51dHJpdGlvbiJdLFsiaXMgdGhlIGNoZW1pY2FsIHJlYWN0aW9ucyB0aGF0IHJlbGVhc2UgZW5lcmd5IGZyb20gZm9vZCIsInJlc3BpcmF0aW9uIl0sWyJpcyBhbiBhY3Rpb24gYnkgYW4gb3JnYW5pc20gb3IgcGFydCBvZiBpdCB0aGF0IGNoYW5nZXMgaXRzIHBvc2l0aW9uIiwibW92ZW1lbnQiXSxbImlzIHNob3duIHdoZW4gYSBwbGFudCBncm93cyB0b3dhcmRzIGEgbGlnaHQgc291cmNlIiwic2Vuc2l0aXZpdHkiXSxbImhhcHBlbnMgY29udGludW91c2x5IGluIGV2ZXJ5IGxpdmluZyBjZWxsIHRvIHJlbGVhc2UgZW5lcmd5IGZyb20gZm9vZCIsInJlc3BpcmF0aW9uIl0sWyJpcyBzaG93biBieSBhbiBhbW9lYmEgbW92aW5nIHVzaW5nIHRlbXBvcmFyeSBleHRlbnNpb25zIGNhbGxlZCBwc2V1ZG9wb2RpYSIsIm1vdmVtZW50Il0sWyJpcyBuZWVkZWQgZm9yIGFuIG9yZ2FuaXNtIHRvIHJlcGxhY2UgZGFtYWdlZCBjZWxscyBhbmQgaW5jcmVhc2UgaW4gc2l6ZSIsImdyb3d0aCJdLFsiZW5zdXJlcyB0aGF0IGEgc3BlY2llcyBjb250aW51ZXMgcmF0aGVyIHRoYW4gZHlpbmcgb3V0IiwicmVwcm9kdWN0aW9uIl0sWyJyZW1vdmVzIGNhcmJvbiBkaW94aWRlIGFuZCB1cmVhLCB3aGljaCB3b3VsZCBiZSB0b3hpYyBpZiB0aGV5IGJ1aWx0IHVwIiwiZXhjcmV0aW9uIl0sWyJpcyBob3cgYSBwbGFudCBvYnRhaW5zIGVuZXJneSBhbmQgcmF3IG1hdGVyaWFscyBmcm9tIHN1bmxpZ2h0LCB3YXRlciBhbmQgbWluZXJhbHMiLCJudXRyaXRpb24iXSxbImlzIHNob3duIHdoZW4gYSB3b29kbG91c2UgbW92ZXMgYXdheSBmcm9tIGJyaWdodCBsaWdodCIsInNlbnNpdGl2aXR5Il0sWyJvY2N1cnMgaW4gbXVzY2xlIGNlbGxzIGR1cmluZyBleGVyY2lzZSwgaW5jbHVkaW5nIGFuYWVyb2JpY2FsbHkgd2hlbiBveHlnZW4gaXMgbGltaXRlZCIsInJlc3BpcmF0aW9uIl0sWyJpcyBzaG93biBieSBzZWVkbGluZ3MgYmVuZGluZyB0byBncm93IHVwd2FyZHMsIGF3YXkgZnJvbSBncmF2aXR5Iiwic2Vuc2l0aXZpdHkiXSxbImhhcHBlbnMgdGhyb3VnaCBjZWxsIGRpdmlzaW9uIGFzIGFuIG9yZ2FuaXNtIGRldmVsb3BzIGZyb20gYSBzaW5nbGUgZmVydGlsaXNlZCBlZ2ciLCJncm93dGgiXSxbImNhbiBiZSBzZXh1YWwgb3IgYXNleHVhbCBkZXBlbmRpbmcgb24gdGhlIG9yZ2FuaXNtIiwicmVwcm9kdWN0aW9uIl0sWyJpcyBob3cgYW5pbWFscyBicmVhayBkb3duIGFuZCBhYnNvcmIgZm9vZCB0aHJvdWdoIGRpZ2VzdGlvbiIsIm51dHJpdGlvbiJdXQ==");
const OSMOSIS: [string, string][] = unpack("W1siQSBwb3RhdG8gY3lsaW5kZXIgaXMgcGxhY2VkIGluIGRpc3RpbGxlZCB3YXRlci4iLCJnYWlucyB3YXRlciJdLFsiQSBwb3RhdG8gY3lsaW5kZXIgaXMgcGxhY2VkIGluIGEgdmVyeSBjb25jZW50cmF0ZWQgc3VnYXIgc29sdXRpb24uIiwibG9zZXMgd2F0ZXIiXSxbIkEgcG90YXRvIGN5bGluZGVyIGlzIHBsYWNlZCBpbiBhIHNvbHV0aW9uIHdpdGggdGhlIHNhbWUgY29uY2VudHJhdGlvbiBhcyBpdHMgY2VsbHMuIiwibm8gbmV0IG1vdmVtZW50Il0sWyJBIHJlZCBibG9vZCBjZWxsIGlzIHBsYWNlZCBpbiBwdXJlIHdhdGVyLiIsImdhaW5zIHdhdGVyIl0sWyJBIHBsYW50IGNlbGwgaXMgcGxhY2VkIGluIGEgc3Ryb25nIHNhbHQgc29sdXRpb24uIiwibG9zZXMgd2F0ZXIiXSxbIkEgY2Fycm90IHN0aWNrIGlzIHBsYWNlZCBpbiBhIGRpbHV0ZSBzb2x1dGlvbi4iLCJnYWlucyB3YXRlciJdLFsiQSBwbGFudCBjZWxsIGlzIHBsYWNlZCBpbiBkaXN0aWxsZWQgd2F0ZXIuIiwiZ2FpbnMgd2F0ZXIiXSxbIkEgcGxhbnQgY2VsbCBpcyBwbGFjZWQgaW4gYSBzb2x1dGlvbiB3aXRoIHRoZSBzYW1lIGNvbmNlbnRyYXRpb24gYXMgdGhlIGNlbGwgc2FwLiIsIm5vIG5ldCBtb3ZlbWVudCJdLFsiQSByZWQgYmxvb2QgY2VsbCBpcyBwbGFjZWQgaW4gYSBjb25jZW50cmF0ZWQgc2FsdCBzb2x1dGlvbi4iLCJsb3NlcyB3YXRlciJdLFsiQSByZWQgYmxvb2QgY2VsbCBpcyBwbGFjZWQgaW4gYSBzb2x1dGlvbiBpc290b25pYyB0byBibG9vZCBwbGFzbWEuIiwibm8gbmV0IG1vdmVtZW50Il0sWyJBIGRyaWVkIHJhaXNpbiBpcyBwbGFjZWQgaW4gd2F0ZXIuIiwiZ2FpbnMgd2F0ZXIiXSxbIkEgZnJlc2ggZ3JhcGUgaXMgcGxhY2VkIGluIGEgc3Ryb25nIHN1Z2FyIHN5cnVwLiIsImxvc2VzIHdhdGVyIl0sWyJBIHBvdGF0byBjeWxpbmRlciBpcyBwbGFjZWQgaW4gdGFwIHdhdGVyIHdpdGggdmVyeSBmZXcgZGlzc29sdmVkIHNvbHV0ZXMuIiwiZ2FpbnMgd2F0ZXIiXSxbIkEgY2Fycm90IHN0aWNrIGlzIHBsYWNlZCBpbiBjb25jZW50cmF0ZWQgYnJpbmUuIiwibG9zZXMgd2F0ZXIiXSxbIlR3byBzb2x1dGlvbnMgb2YgZXF1YWwgY29uY2VudHJhdGlvbiBhcmUgc2VwYXJhdGVkIGJ5IGEgcGFydGlhbGx5IHBlcm1lYWJsZSBtZW1icmFuZS4iLCJubyBuZXQgbW92ZW1lbnQiXSxbIkEgcGxhbnQgY2VsbCBpcyBwbGFjZWQgaW4gYSBzb2x1dGlvbiBtb3JlIGNvbmNlbnRyYXRlZCB0aGFuIGl0cyBjeXRvcGxhc20uIiwibG9zZXMgd2F0ZXIiXSxbIkFuIGFuaW1hbCBjZWxsIGlzIHBsYWNlZCBpbiBhIHNvbHV0aW9uIG1vcmUgZGlsdXRlIHRoYW4gaXRzIGN5dG9wbGFzbS4iLCJnYWlucyB3YXRlciJdLFsiQSB3aWx0ZWQgY2VsZXJ5IHN0aWNrIGlzIHBsYWNlZCBpbiBmcmVzaCB3YXRlci4iLCJnYWlucyB3YXRlciJdLFsiQSBjdWN1bWJlciBzbGljZSBpcyBwbGFjZWQgaW4gYSBzYWx0eSBtYXJpbmFkZS4iLCJsb3NlcyB3YXRlciJdLFsiQSBjZWxsIGlzIHBsYWNlZCBpbiBhIHNvbHV0aW9uIHdpdGggaWRlbnRpY2FsIHdhdGVyIHBvdGVudGlhbCB0byBpdHMgb3duLiIsIm5vIG5ldCBtb3ZlbWVudCJdXQ==");

const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

const ORGANELLE_NOTE: Record<string, string> = {
  nucleus: "It holds the DNA, so it is the cell's control centre",
  mitochondria: "It releases energy from glucose, so it is the cell's power station",
  chloroplast: "It contains chlorophyll and makes food by photosynthesis, so only plant cells have it",
  "cell membrane": "It is a thin, partially permeable barrier that controls what passes in and out",
  ribosome: "It joins amino acids together to make proteins",
  "cell wall": "It is a tough layer outside the membrane of plant cells that gives them a fixed shape",
  vacuole: "In plant cells it is a large sac that stores water and dissolved substances",
  lysosome: "It contains digestive enzymes that break down waste and worn-out parts of the cell",
  "Golgi apparatus": "It modifies and packages proteins into vesicles ready for transport",
  "endoplasmic reticulum": "It is a folded network of membranes used to make and move proteins or lipids",
  "nuclear membrane": "It is the double membrane surrounding the nucleus, with pores that let substances pass through",
};

const LEVEL_NOTE: Record<string, string> = {
  cell: "the basic unit of life",
  tissue: "a group of similar cells doing the same job",
  organ: "a group of different tissues working together for one function",
  "organ system": "a group of organs working together",
  organism: "a whole living individual made of organ systems",
};

const PROCESS_NOTE: Record<string, string> = {
  replication: "DNA is copied before a cell divides, so each new cell gets a full set",
  transcription: "a gene in the DNA in the nucleus is copied into mRNA",
  translation: "a ribosome reads the mRNA codons and builds a protein",
  mutation: "a permanent change in the DNA base sequence",
};

const FEEDBACK_NOTE: Record<string, string> = {
  "negative feedback": "the response reverses the change and brings the level back towards normal",
  "positive feedback": "the response makes the original change bigger, pushing the level further away from where it started",
};

const ENZYME_NOTE: Record<string, string> = {
  increases: "particles move faster or meet more often, so there are more successful enzyme-substrate collisions",
  decreases: "the enzyme's active site changes shape, so the substrate no longer fits and fewer reactions happen",
  "stays the same": "the enzyme is already working at its maximum, so adding more of the other factor makes no difference",
};

const LOCATION_NOTE: Record<string, string> = {
  cytoplasm: "the jelly-like fluid of the cell, where reactions that need no organelle happen",
  "mitochondrial matrix": "the fluid inside the mitochondrion, where the enzymes of the Krebs cycle are found",
  "inner mitochondrial membrane": "the folded inner membrane, which holds the electron transport chain",
  "thylakoid membranes": "the membranes inside the chloroplast that hold the chlorophyll and capture light",
  stroma: "the fluid around the thylakoids, where the Calvin cycle builds sugar",
};

const OSMOSIS_NOTE: Record<string, string> = {
  "gains water": "Water moves by osmosis from the more dilute solution to the more concentrated one. The cells are more concentrated than the surroundings, so water moves in",
  "loses water": "Water moves by osmosis from the more dilute solution to the more concentrated one. The surroundings are more concentrated than the cells, so water moves out",
  "no net movement": "Water moves in and out at the same rate when both sides have the same concentration, so there is no net movement",
};

const EXPLAIN: Record<string, (item: string, answer: string) => string> = {
  "cell-structures": (d, a) => `The ${a} ${a === "mitochondria" ? d.replace(/^is /, "are ") : d}. ${ORGANELLE_NOTE[a]}.`,
  "levels-of-organisation": (x, a) => `"${x}" is ${article(a)} ${a}: ${LEVEL_NOTE[a]}. Levels run cell, tissue, organ, organ system, organism.`,
  "body-systems": (d, a) => `The ${a} system ${d}.`,
  "photosynthesis-respiration": (x, a) =>
    `The missing word is ${a}, so the sentence reads: "${x.replace("___", a)}" Remember the two equations. Photosynthesis is carbon dioxide + water -> glucose + oxygen (using light). Respiration is glucose + oxygen -> carbon dioxide + water + energy.`,
  "dna-processes": (x, a) => `"${x}" describes ${a}: ${PROCESS_NOTE[a]}.`,
  "natural-selection": (d, a) => `${a[0].toUpperCase()}${a.slice(1)} ${d}.`,
  "feedback-loops": (x, a) => `"${x}" is ${a}: ${FEEDBACK_NOTE[a]}.`,
  "enzyme-activity": (x, a) => `When ${x}, the rate ${a}: ${ENZYME_NOTE[a]}.`,
  "cell-process-locations": (x, a) => `${x} takes place in the ${a}, which is ${LOCATION_NOTE[a]}.`,
  "characteristics-of-life": (d, a) => `${a[0].toUpperCase()}${a.slice(1)} ${d}.`,
  "osmosis-predictions": (_x, a) => `${OSMOSIS_NOTE[a]}. So: ${a}.`,
};

function bankTopic(
  id: string,
  label: string,
  bank: [string, string][],
  prompt: (item: string) => string,
  pool?: string[],
): Topic {
  return bankMCQ(
    id,
    label,
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer, explanation: EXPLAIN[id]?.(item, answer) })),
    pool,
  );
}

// ---------- Grades 9-10 ----------

function cellStructures(): Topic {
  return bankTopic("cell-structures", "Cell structures", ORGANELLES, (d) => `Which cell structure ${d}?`, [
    "nucleus",
    "mitochondria",
    "chloroplast",
    "cell membrane",
    "ribosome",
    "cell wall",
    "vacuole",
    "lysosome",
    "Golgi apparatus",
    "endoplasmic reticulum",
    "nuclear membrane",
  ]);
}

function levelsOfOrganisation(): Topic {
  return bankTopic(
    "levels-of-organisation",
    "Levels of organisation",
    LEVELS,
    (x) => `Which level of biological organisation is this? "${x}"`,
    ["cell", "tissue", "organ", "organ system", "organism"],
  );
}

function bodySystems(): Topic {
  return bankTopic("body-systems", "Body systems", SYSTEMS, (d) => `Which body system ${d}?`, [
    "circulatory",
    "digestive",
    "respiratory",
    "nervous",
    "skeletal",
    "excretory",
  ]);
}

function photosynthesisAndRespiration(): Topic {
  return bankTopic(
    "photosynthesis-respiration",
    "Photosynthesis and respiration",
    EQUATION_FACTS,
    (x) => `Fill in the blank: ${x}`,
    ["water", "oxygen", "carbon dioxide", "glucose", "light"],
  );
}

function monohybridCross(): Topic {
  const crossPatterns: [string, string][] = [
    ["Xx", "Xx"],
    ["Xx", "xx"],
    ["XX", "xx"],
    ["XX", "Xx"],
  ];
  const traits: [string, string, string, string, boolean][] = [
    ["pea plants", "tall", "short", "T", true],
    ["pea plants", "purple flower colour", "white flower colour", "P", false],
    ["pea plants", "round seed shape", "wrinkled seed shape", "R", false],
    ["guinea pigs", "black fur", "white fur", "B", false],
    ["mice", "brown fur", "grey fur", "F", false],
    ["dogs", "curly fur", "straight fur", "C", false],
  ];
  return {
    id: "monohybrid-cross",
    label: "Punnett squares (one gene)",
    generate: () => {
      const [organism, dominantTrait, recessiveTrait, letter, isAdjective] = pick(traits);
      const sub = (pattern: string) => pattern.replace(/X/g, letter).replace(/x/g, letter.toLowerCase());
      const [p1, p2] = pick(crossPatterns).map(sub);
      let dominantCount = 0;
      let total = 0;
      const boxes: string[] = [];
      for (const a of p1) {
        for (const b of p2) {
          total++;
          if (a === letter || b === letter) dominantCount++;
          boxes.push([a, b].sort().join(""));
        }
      }
      const wantDominant = Math.random() < 0.5;
      const count = wantDominant ? dominantCount : total - dominantCount;
      const pct = (count / total) * 100;
      const wantedTrait = wantDominant ? dominantTrait : recessiveTrait;
      const have = (trait: string) => (isAdjective ? `be ${trait}` : `have ${trait}`);
      return {
        prompt: `In ${organism}, ${dominantTrait} (${letter}) is dominant over ${recessiveTrait} (${letter.toLowerCase()}). Two individuals with genotypes ${p1} and ${p2} are crossed. What percentage of the offspring are expected to ${have(wantedTrait)}?`,
        answer: `${pct}%`,
        explanation: `Fill the Punnett square: each parent gives one allele. ${p1} x ${p2} gives the offspring ${boxes.join(", ")}. An individual ${isAdjective ? "is" : "has"} ${dominantTrait} if it has at least one ${letter}, so ${dominantCount} of the ${total} boxes ${isAdjective ? "are" : "have"} ${dominantTrait} and ${total - dominantCount} ${isAdjective ? "are" : "have"} ${recessiveTrait}. ${count}/${total} = ${pct}%.`,
      };
    },
  };
}

function energyTransfer(): Topic {
  const levels = ["primary consumer", "secondary consumer", "tertiary consumer"];
  return {
    id: "energy-transfer",
    label: "Energy transfer in food chains",
    generate: () => {
      const energy = randInt(1, 9) * 10000;
      const level = randInt(1, 3);
      const steps = Array.from({ length: level + 1 }, (_, i) => energy / 10 ** i);
      return {
        prompt: `Producers in a food chain capture ${energy} kJ of energy. Assuming only 10% of the energy is passed on at each level, how much energy reaches the ${levels[level - 1]}?`,
        answer: `${energy / 10 ** level} kJ`,
        explanation: `Only 10% is passed on at each step, so divide by 10 each time: ${steps.map((e) => `${e} kJ`).join(" -> ")}. The ${levels[level - 1]} is ${level} step${level > 1 ? "s" : ""} after the producers, so it receives ${energy / 10 ** level} kJ.`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function dnaProcesses(): Topic {
  return bankTopic(
    "dna-processes",
    "DNA replication, transcription and translation",
    DNA_PROCESSES,
    (x) => `Which process is described? "${x}"`,
    ["replication", "transcription", "translation", "mutation"],
  );
}

function dnaComplement(): Topic {
  const dnaPair: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
  const rnaPair: Record<string, string> = { A: "U", T: "A", G: "C", C: "G" };
  return {
    id: "dna-complement",
    label: "Base pairing and transcription",
    generate: () => {
      const seq = Array.from({ length: 6 }, () => pick(["A", "T", "G", "C"])).join("");
      if (Math.random() < 0.5) {
        return {
          prompt: `A DNA strand has the base sequence ${seq}. Write the sequence of the complementary DNA strand.`,
          answer: [...seq].map((b) => dnaPair[b]).join(""),
          explanation: `Pair each base with its partner: A with T and G with C. ${[...seq].map((b) => `${b}-${dnaPair[b]}`).join(", ")} gives ${[...seq].map((b) => dnaPair[b]).join("")}.`,
        };
      }
      return {
        prompt: `A DNA template strand has the base sequence ${seq}. Write the sequence of the mRNA transcribed from it.`,
        answer: [...seq].map((b) => rnaPair[b]).join(""),
        explanation: `mRNA pairs with the DNA template: A with U (RNA has no T), T with A, G with C, C with G. ${[...seq].map((b) => `${b}-${rnaPair[b]}`).join(", ")} gives ${[...seq].map((b) => rnaPair[b]).join("")}.`,
      };
    },
  };
}

function dihybridCross(): Topic {
  // The boolean says whether the first letter, spoken aloud (ay, ar, ess, ...), starts with a vowel sound.
  const letterPairs: [string, string, boolean][] = [
    ["A", "B", true],
    ["R", "Y", true],
    ["T", "W", false],
    ["S", "L", true],
    ["G", "H", false],
  ];
  return {
    id: "dihybrid-cross",
    label: "Dihybrid crosses",
    generate: () => {
      const [g1, g2, startsWithVowelSound] = pick(letterPairs);
      const outcomes = [
        { desc: `the dominant trait for both ${g1} and ${g2}`, frac: "9/16" },
        { desc: `the dominant trait for ${g1} and the recessive trait for ${g2}`, frac: "3/16" },
        { desc: `the recessive trait for ${g1} and the dominant trait for ${g2}`, frac: "3/16" },
        { desc: `the recessive trait for both ${g1} and ${g2}`, frac: "1/16" },
      ];
      const o = pick(outcomes);
      const genotype = `${g1}${g1.toLowerCase()}${g2}${g2.toLowerCase()}`;
      return {
        prompt: `In a dihybrid cross between two ${genotype} parents (${g1} and ${g2} are dominant, and the genes assort independently), what fraction of the offspring are expected to show ${o.desc}?`,
        answer: o.frac,
        explanation: `${startsWithVowelSound ? "An" : "A"} ${genotype} x ${genotype} cross gives 16 equal combinations in the ratio 9 : 3 : 3 : 1 (both dominant : one dominant : the other dominant : both recessive). For ${o.desc}, that is ${o.frac}.`,
      };
    },
  };
}

function naturalSelection(): Topic {
  return bankTopic("natural-selection", "Natural selection and evolution", NATURAL_SELECTION, (d) => `Which term ${d}?`, [
    "variation",
    "natural selection",
    "inheritance",
    "overproduction",
    "evolution",
    "speciation",
  ]);
}

function homeostasisFeedback(): Topic {
  return bankTopic(
    "feedback-loops",
    "Homeostasis and feedback",
    FEEDBACK,
    (x) => `Is this an example of negative feedback or positive feedback? "${x}"`,
    ["negative feedback", "positive feedback"],
  );
}

function enzymeActivity(): Topic {
  return bankTopic(
    "enzyme-activity",
    "Enzyme activity",
    ENZYMES,
    (x) => `What happens to the rate of an enzyme-catalysed reaction when ${x}?`,
    ["increases", "decreases", "stays the same"],
  );
}

function magnification(): Topic {
  return {
    id: "magnification",
    label: "Magnification",
    generate: () => {
      const actual = pick([10, 20, 25, 40, 50]);
      const mag = pick([40, 100, 400, 1000]);
      return {
        prompt: `A specimen has an actual length of ${actual} micrometres. In a micrograph its image is ${actual * mag} micrometres long. Calculate the magnification (as a number).`,
        answer: String(mag),
        explanation: `Magnification = image size / actual size = ${actual * mag} / ${actual} = ${mag}.`,
      };
    },
  };
}

function surfaceAreaToVolume(): Topic {
  return {
    id: "sa-to-volume",
    label: "Surface area to volume ratio",
    generate: () => {
      const side = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40, 48, 50, 75, 100]);
      return {
        prompt: `A cube-shaped cell has sides of length ${side} cm. Calculate its surface area to volume ratio (write your answer as x:1).`,
        answer: `${6 / side}:1`,
        explanation: `A cube has 6 faces, so surface area = 6 x ${side}^2 = ${6 * side * side} cm^2. Volume = ${side}^3 = ${side ** 3} cm^3. Ratio = ${6 * side * side} : ${side ** 3}, which simplifies to ${6 / side} : 1.`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function hardyWeinberg(): Topic {
  return {
    id: "hardy-weinberg",
    label: "Hardy-Weinberg calculations",
    generate: () => {
      const q = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
      return {
        prompt: `In a population in Hardy-Weinberg equilibrium, the frequency of the homozygous recessive genotype (q^2) is ${(q * q).toFixed(2)}. What is the frequency of heterozygous carriers (2pq)?`,
        answer: (2 * (1 - q) * q).toFixed(2),
        explanation: `q^2 = ${(q * q).toFixed(2)}, so q = the square root = ${q}. Then p = 1 - q = ${(1 - q).toFixed(1)}. Carriers are 2pq = 2 x ${(1 - q).toFixed(1)} x ${q} = ${(2 * (1 - q) * q).toFixed(2)}.`,
      };
    },
  };
}

function cellProcessLocations(): Topic {
  return bankTopic(
    "cell-process-locations",
    "Where cell processes occur",
    CELL_LOCATIONS,
    (x) => `Where in the cell does this stage occur? "${x}"`,
    ["cytoplasm", "mitochondrial matrix", "inner mitochondrial membrane", "thylakoid membranes", "stroma"],
  );
}

function xLinkedInheritance(): Topic {
  const scenarios = [
    {
      setup: "A mother is a carrier of an X-linked recessive condition and the father is unaffected.",
      parents: "The mother is XAXa and the father is XAY.",
      questions: [
        {
          q: "What is the probability that a son is affected?",
          a: "50%",
          why: "A son gets his X from his mother. Half of her eggs carry the recessive allele (Xa) and half carry the normal one (XA), and his Y from his father, so 50% of sons are affected.",
        },
        {
          q: "What is the probability that a daughter is affected?",
          a: "0%",
          why: "A daughter gets an X from each parent. Her father is unaffected (XAY), so she always gets his normal XA and cannot be affected, so the probability is 0%.",
        },
        {
          q: "What is the probability that a daughter is a carrier?",
          a: "50%",
          why: "A daughter always gets the normal XA from her father. She is a carrier (XAXa) only if she also gets the Xa from her mother, which happens for half of the eggs, so 50%.",
        },
      ],
    },
    {
      setup: "A mother is affected by an X-linked recessive condition and the father is unaffected.",
      parents: "The mother is XaXa and the father is XAY.",
      questions: [
        {
          q: "What is the probability that a son is affected?",
          a: "100%",
          why: "A son always gets his mother's only allele, Xa, and his Y from his father, making him XaY, which is affected. So 100% of sons are affected.",
        },
        {
          q: "What is the probability that a daughter is affected?",
          a: "0%",
          why: "A daughter always gets the father's normal XA as well as the mother's Xa, making her XAXa, a carrier, so she is never affected.",
        },
        {
          q: "What is the probability that a daughter is a carrier?",
          a: "100%",
          why: "Every daughter gets Xa from her mother and XA from her father, making her XAXa, a carrier, every time.",
        },
      ],
    },
    {
      setup: "A mother is a carrier of an X-linked recessive condition and the father is affected.",
      parents: "The mother is XAXa and the father is XaY.",
      questions: [
        {
          q: "What is the probability that a son is affected?",
          a: "50%",
          why: "A son gets his Y from his father and his X from his mother, who passes on Xa half the time, so 50% of sons are affected (XaY).",
        },
        {
          q: "What is the probability that a daughter is affected?",
          a: "50%",
          why: "A daughter always gets Xa from her affected father. She is affected (XaXa) only if she also gets Xa from her mother, which happens half the time, so 50%.",
        },
        {
          q: "What is the probability that a daughter is a carrier (not affected)?",
          a: "50%",
          why: "A daughter who gets XA from her mother instead (the other half of the time) is XAXa, a carrier rather than affected, so 50%.",
        },
      ],
    },
  ];
  return {
    id: "x-linked",
    label: "X-linked inheritance",
    generate: () => {
      const scenario = pick(scenarios);
      const item = pick(scenario.questions);
      return {
        prompt: `${scenario.setup} ${item.q}`,
        answer: item.a,
        explanation: `${scenario.parents} ${item.why}`,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function characteristicsOfLife(): Topic {
  return bankTopic(
    "characteristics-of-life",
    "Characteristics of living organisms",
    CHARACTERISTICS,
    (d) => `Which characteristic of living organisms ${d}?`,
    ["sensitivity", "excretion", "growth", "reproduction", "nutrition", "respiration", "movement"],
  );
}

function osmosisPredictions(): Topic {
  return bankTopic(
    "osmosis-predictions",
    "Osmosis predictions",
    OSMOSIS,
    (x) => `Predict the net movement of water by osmosis: ${x}`,
    ["gains water", "loses water", "no net movement"],
  );
}

function osmosisPercentageChange(): Topic {
  return {
    id: "osmosis-percentage-change",
    label: "Percentage change in mass",
    generate: () => {
      const initial = pick([2, 4, 5, 10, 20]);
      const pct = pick([10, 20, 25, 40]);
      const increase = Math.random() < 0.5;
      const final = (initial * (increase ? 100 + pct : 100 - pct)) / 100;
      return {
        prompt: `A potato cylinder has a mass of ${initial} g before and ${final} g after being left in a solution. Calculate the percentage ${increase ? "increase" : "decrease"} in mass.`,
        answer: `${pct}%`,
        explanation: `Percentage change = (change / original) x 100. The change is ${Math.abs(final - initial)} g, so ${Math.abs(final - initial)} / ${initial} x 100 = ${pct}%.`,
      };
    },
  };
}

function baseBiologyTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [
      cellStructures(),
      levelsOfOrganisation(),
      bodySystems(),
      photosynthesisAndRespiration(),
      monohybridCross(),
      energyTransfer(),
    ];
  }
  return [
    dnaProcesses(),
    dnaComplement(),
    dihybridCross(),
    naturalSelection(),
    homeostasisFeedback(),
    enzymeActivity(),
    magnification(),
    surfaceAreaToVolume(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedBiologyExtras(grade: number): Topic[] {
  if (grade <= 10) return [dnaProcesses(), dihybridCross()];
  return [hardyWeinberg(), cellProcessLocations(), xLinkedInheritance()];
}

function cambridgeBiologyExtras(grade: number): Topic[] {
  return grade >= 9 ? [characteristicsOfLife(), osmosisPredictions(), osmosisPercentageChange()] : [];
}

export function getBiologyTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = [...baseBiologyTopics(grade), ...moreBiologyTopics(grade), biologyWordProblems(grade)];
  const advanced = difficulty === "advanced" ? advancedBiologyExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeBiologyExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
