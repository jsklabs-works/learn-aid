import type { Difficulty, Syllabus, Topic } from "../types";
import { unpack } from "./codec";
import { bankMCQ, pick, randInt } from "./utils";
import { moreEconomicsTopics } from "./electivesMore";
import { economicsWordProblems } from "./wordProblemsMore";

const SUPPLY_DEMAND: [string, string][] = unpack("W1siRGVtYW5kIGluY3JlYXNlcyB3aGlsZSBzdXBwbHkgc3RheXMgdGhlIHNhbWUuIiwicHJpY2UgcmlzZXMiXSxbIkRlbWFuZCBkZWNyZWFzZXMgd2hpbGUgc3VwcGx5IHN0YXlzIHRoZSBzYW1lLiIsInByaWNlIGZhbGxzIl0sWyJTdXBwbHkgaW5jcmVhc2VzIHdoaWxlIGRlbWFuZCBzdGF5cyB0aGUgc2FtZS4iLCJwcmljZSBmYWxscyJdLFsiU3VwcGx5IGRlY3JlYXNlcyB3aGlsZSBkZW1hbmQgc3RheXMgdGhlIHNhbWUuIiwicHJpY2UgcmlzZXMiXSxbIkEgaG90IHN1bW1lciBncmVhdGx5IGluY3JlYXNlcyBkZW1hbmQgZm9yIGljZSBjcmVhbSAoc3VwcGx5IGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgcmlzZXMiXSxbIkEgbmV3IHRlY2hub2xvZ3kgbG93ZXJzIHByb2R1Y3Rpb24gY29zdHMgYW5kIGluY3JlYXNlcyBzdXBwbHkgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIGZhbGxzIl0sWyJBIHBvb3IgaGFydmVzdCByZWR1Y2VzIHRoZSBzdXBwbHkgb2Ygd2hlYXQgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIHJpc2VzIl0sWyJBIGhlYWx0aCBzY2FyZSByZWR1Y2VzIGRlbWFuZCBmb3IgYSBmb29kIChzdXBwbHkgaXMgdW5jaGFuZ2VkKS4iLCJwcmljZSBmYWxscyJdLFsiQSBwb3B1bGFyIG5ldyBzbWFydHBob25lIG1vZGVsIGNhdXNlcyBhIHN1cmdlIGluIGRlbWFuZCAoc3VwcGx5IGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgcmlzZXMiXSxbIkEgZ2x1dCBvZiBvdmVyc3VwcGx5IGhpdHMgdGhlIG1hcmtldCBmb3IgYSBjcm9wIChkZW1hbmQgaXMgdW5jaGFuZ2VkKS4iLCJwcmljZSBmYWxscyJdLFsiRmV3ZXIgZmlybXMgcHJvZHVjZSBhIGdvb2QgYWZ0ZXIgc2V2ZXJhbCBnbyBvdXQgb2YgYnVzaW5lc3MgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIHJpc2VzIl0sWyJBIGNoZWFwZXIgc3Vic3RpdHV0ZSBwcm9kdWN0IGRyYXdzIGN1c3RvbWVycyBhd2F5IChzdXBwbHkgaXMgdW5jaGFuZ2VkKS4iLCJwcmljZSBmYWxscyJdLFsiQSBwb3B1bGFyIHNvY2lhbCBtZWRpYSB0cmVuZCBib29zdHMgZGVtYW5kIGZvciBhIGZhc2hpb24gaXRlbSAoc3VwcGx5IGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgcmlzZXMiXSxbIkFuIGluY3JlYXNlZCBudW1iZXIgb2Ygc2VsbGVycyBlbnRlcnMgdGhlIG1hcmtldCAoZGVtYW5kIGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgZmFsbHMiXSxbIkEgc2hvcnRhZ2Ugb2YgcmF3IG1hdGVyaWFscyBjdXRzIHByb2R1Y3Rpb24gKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIHJpc2VzIl0sWyJDb25zdW1lciBpbmNvbWVzIGZhbGwgZHVyaW5nIGEgcmVjZXNzaW9uLCByZWR1Y2luZyBkZW1hbmQgZm9yIGEgbHV4dXJ5IGdvb2QgKHN1cHBseSBpcyB1bmNoYW5nZWQpLiIsInByaWNlIGZhbGxzIl0sWyJBIG5ldyBtaW5lIGRpc2NvdmVyeSBncmVhdGx5IGluY3JlYXNlcyB0aGUgc3VwcGx5IG9mIGEgbWluZXJhbCAoZGVtYW5kIGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgZmFsbHMiXSxbIlNldmVyZSB3ZWF0aGVyIGRpc3J1cHRzIHRyYW5zcG9ydCBhbmQgcmVkdWNlcyB0aGUgc3VwcGx5IG9mIGZyZXNoIHByb2R1Y2UgKGRlbWFuZCBpcyB1bmNoYW5nZWQpLiIsInByaWNlIHJpc2VzIl0sWyJHb3Zlcm5tZW50IHN1YnNpZGllcyBpbmNyZWFzZSB0aGUgc3VwcGx5IG9mIGEgZ29vZCAoZGVtYW5kIGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgZmFsbHMiXSxbIkEgc3VjY2Vzc2Z1bCBhZHZlcnRpc2luZyBjYW1wYWlnbiBzaWduaWZpY2FudGx5IGluY3JlYXNlcyBkZW1hbmQgZm9yIGEgcHJvZHVjdCAoc3VwcGx5IGlzIHVuY2hhbmdlZCkuIiwicHJpY2UgcmlzZXMiXV0=");
const SYSTEMS: [string, string][] = unpack("W1siYWxsb2NhdGVzIHJlc291cmNlcyBtYWlubHkgdGhyb3VnaCBwcmljZXMgaW4gbWFya2V0cywgd2l0aCBsaXR0bGUgZ292ZXJubWVudCBpbnZvbHZlbWVudCIsIm1hcmtldCBlY29ub215Il0sWyJoYXMgdGhlIGdvdmVybm1lbnQgZGVjaWRlIHdoYXQsIGhvdyBhbmQgZm9yIHdob20gdG8gcHJvZHVjZSIsImNvbW1hbmQgZWNvbm9teSJdLFsiY29tYmluZXMgcHJpdmF0ZSBtYXJrZXRzIHdpdGggc29tZSBnb3Zlcm5tZW50IGRpcmVjdGlvbiIsIm1peGVkIGVjb25vbXkiXSxbInJlbGllcyBvbiBjdXN0b20gYW5kIHRyYWRpdGlvbiB0byBkZWNpZGUgd2hhdCBpcyBwcm9kdWNlZCIsInRyYWRpdGlvbmFsIGVjb25vbXkiXSxbImlzIGJlc3QgZGVzY3JpYmVkIGJ5IGNlbnRyYWwgcGxhbm5pbmcgb2YgYWxtb3N0IGFsbCBwcm9kdWN0aW9uIiwiY29tbWFuZCBlY29ub215Il0sWyJpcyB0eXBpY2FsIG9mIG1vc3QgbW9kZXJuIGNvdW50cmllcywgd2l0aCBib3RoIHByaXZhdGUgZmlybXMgYW5kIHB1YmxpYyBzZXJ2aWNlcyIsIm1peGVkIGVjb25vbXkiXSxbImlzIGlsbHVzdHJhdGVkIGJ5IE5vcnRoIEtvcmVhLCB3aGVyZSB0aGUgc3RhdGUgY29udHJvbHMgYWxtb3N0IGFsbCBwcm9kdWN0aW9uIiwiY29tbWFuZCBlY29ub215Il0sWyJyZWxpZXMgb24gc3VwcGx5IGFuZCBkZW1hbmQgaW4gZnJlZSBtYXJrZXRzIHRvIHNldCBtb3N0IHByaWNlcyIsIm1hcmtldCBlY29ub215Il0sWyJpcyBpbGx1c3RyYXRlZCBieSBBdXN0cmFsaWEsIGNvbWJpbmluZyBmcmVlIG1hcmtldHMgd2l0aCBnb3Zlcm5tZW50IHdlbGZhcmUgYW5kIHJlZ3VsYXRpb24iLCJtaXhlZCBlY29ub215Il0sWyJkZXNjcmliZXMgYSByZW1vdGUgY29tbXVuaXR5IHRoYXQgZmFybXMgYW5kIGh1bnRzIHRoZSB3YXkgaXRzIGFuY2VzdG9ycyBkaWQiLCJ0cmFkaXRpb25hbCBlY29ub215Il0sWyJoYXMgdGhlIGdvdmVybm1lbnQgb3duIGFuZCBkaXJlY3QgbWFqb3IgaW5kdXN0cmllcyIsImNvbW1hbmQgZWNvbm9teSJdLFsibGV0cyBwcml2YXRlIGJ1c2luZXNzZXMgY29tcGV0ZSB3aXRoIGxpdHRsZSBnb3Zlcm5tZW50IGludGVyZmVyZW5jZSIsIm1hcmtldCBlY29ub215Il0sWyJjb21iaW5lcyBwdWJsaWMgc2Nob29scyBhbmQgaG9zcGl0YWxzIHdpdGggcHJpdmF0ZSBidXNpbmVzc2VzIiwibWl4ZWQgZWNvbm9teSJdLFsiZGVzY3JpYmVzIGEgc29jaWV0eSB0aGF0IGV4Y2hhbmdlcyBnb29kcyBiYXNlZCBvbiBsb25nLXN0YW5kaW5nIGN1c3RvbSByYXRoZXIgdGhhbiBtYXJrZXQgcHJpY2VzIiwidHJhZGl0aW9uYWwgZWNvbm9teSJdLFsiaXMgaWxsdXN0cmF0ZWQgYnkgYSBjb3VudHJ5IHdob3NlIGVjb25vbXkgaGFzIGhpc3RvcmljYWxseSBiZWVuIGNlbnRyYWxseSBwbGFubmVkIGJ5IHRoZSBzdGF0ZSIsImNvbW1hbmQgZWNvbm9teSJdLFsiaXMgaWxsdXN0cmF0ZWQgYnkgYW4gZWNvbm9teSBsYXJnZWx5IGRyaXZlbiBieSBwcml2YXRlIGVudGVycHJpc2UgYW5kIG1hcmtldHMiLCJtYXJrZXQgZWNvbm9teSJdLFsiaXMgaWxsdXN0cmF0ZWQgYnkgYW4gZWNvbm9teSB3aXRoIHB1YmxpYyBzZXJ2aWNlcyBhbG9uZ3NpZGUgcHJpdmF0ZSBpbmR1c3RyeSIsIm1peGVkIGVjb25vbXkiXSxbImRlc2NyaWJlcyBhbiBpbmRpZ2Vub3VzIGNvbW11bml0eSByZWx5aW5nIG9uIHRyYWRpdGlvbmFsIGZhcm1pbmcgbWV0aG9kcyBwYXNzZWQgZG93biBnZW5lcmF0aW9ucyIsInRyYWRpdGlvbmFsIGVjb25vbXkiXSxbImhhcyBhIGNlbnRyYWwgcGxhbm5pbmcgYXV0aG9yaXR5IGRlY2lkZSBwcm9kdWN0aW9uIHRhcmdldHMgZm9yIGZhY3RvcmllcyIsImNvbW1hbmQgZWNvbm9teSJdLFsiaGFzIHByaWNlcyBtb3N0bHkgZGV0ZXJtaW5lZCBieSBjb25zdW1lcnMgYW5kIHByb2R1Y2VycyBpbiBjb21wZXRpdGl2ZSBtYXJrZXRzIiwibWFya2V0IGVjb25vbXkiXV0=");
const FACTORS: [string, string][] = unpack("W1siQSBmYXJtZXIncyBwYWRkb2NrIiwibGFuZCJdLFsiSXJvbiBvcmUgaW4gdGhlIGdyb3VuZCIsImxhbmQiXSxbIkEgdGVhY2hlcidzIHdvcmsiLCJsYWJvdXIiXSxbIkEgZGVsaXZlcnkgZHJpdmVyJ3MgdGltZSIsImxhYm91ciJdLFsiQSBiYWtlcnkncyBvdmVucyIsImNhcGl0YWwiXSxbIkEgdHJ1Y2sgb3duZWQgYnkgYSBidXNpbmVzcyIsImNhcGl0YWwiXSxbIkEgcGVyc29uIHdobyBvcmdhbmlzZXMgcmVzb3VyY2VzIGFuZCB0YWtlcyBvbiB0aGUgcmlzayBvZiBhIG5ldyBidXNpbmVzcyIsImVudGVycHJpc2UiXSxbIkFuIGVudHJlcHJlbmV1ciBsYXVuY2hpbmcgYSBzdGFydC11cCIsImVudGVycHJpc2UiXSxbIkEgZmlzaGluZyBmbGVldCdzIHRyYXdsZXJzIiwiY2FwaXRhbCJdLFsiTWluZXJhbHMgbWluZWQgZnJvbSB0aGUgZWFydGgiLCJsYW5kIl0sWyJBIGNoZWYncyBjb29raW5nIHNraWxscyIsImxhYm91ciJdLFsiQSBmYWN0b3J5IGJ1aWxkaW5nIiwiY2FwaXRhbCJdLFsiRm9yZXN0cyBoYXJ2ZXN0ZWQgZm9yIHRpbWJlciIsImxhbmQiXSxbIkEgbnVyc2UncyB0aW1lIGNhcmluZyBmb3IgcGF0aWVudHMiLCJsYWJvdXIiXSxbIkNvbXB1dGVycyB1c2VkIGluIGFuIG9mZmljZSIsImNhcGl0YWwiXSxbIkZyZXNoIHdhdGVyIHVzZWQgaW4gZmFybWluZyIsImxhbmQiXSxbIkFuIGludmVudG9yIHdobyByaXNrcyB0aGVpciBzYXZpbmdzIHRvIHN0YXJ0IGEgY29tcGFueSIsImVudGVycHJpc2UiXSxbIkEgdHJhY3RvciB1c2VkIG9uIGEgZmFybSIsImNhcGl0YWwiXSxbIkEgY29uc3RydWN0aW9uIHdvcmtlcidzIGxhYm91ciIsImxhYm91ciJdLFsiQSBidXNpbmVzcyBvd25lciB3aG8gdGFrZXMgb24gdGhlIHJpc2sgb2YgYSBuZXcgdmVudHVyZSIsImVudGVycHJpc2UiXV0=");
const POLICY: [string, string][] = unpack("W1siVGhlIGNlbnRyYWwgYmFuayByYWlzZXMgaW50ZXJlc3QgcmF0ZXMiLCJtb25ldGFyeSBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGN1dHMgaW5jb21lIHRheCByYXRlcyIsImZpc2NhbCBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGluY3JlYXNlcyBzcGVuZGluZyBvbiBpbmZyYXN0cnVjdHVyZSIsImZpc2NhbCBwb2xpY3kiXSxbIlRoZSBjZW50cmFsIGJhbmsgbG93ZXJzIGludGVyZXN0IHJhdGVzIiwibW9uZXRhcnkgcG9saWN5Il0sWyJUaGUgZ292ZXJubWVudCByYWlzZXMgdGhlIHNhbGVzIHRheCByYXRlIiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayBidXlzIGJvbmRzIHRvIGluY3JlYXNlIHRoZSBtb25leSBzdXBwbHkiLCJtb25ldGFyeSBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGluY3JlYXNlcyBzcGVuZGluZyBvbiBwdWJsaWMgaG9zcGl0YWxzIiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayBzZXRzIGEgdGFyZ2V0IGZvciB0aGUgbW9uZXkgc3VwcGx5IiwibW9uZXRhcnkgcG9saWN5Il0sWyJUaGUgZ292ZXJubWVudCBpbnRyb2R1Y2VzIGEgdGF4IHJlYmF0ZSBmb3IgbG93LWluY29tZSBlYXJuZXJzIiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayBhZGp1c3RzIHRoZSBvZmZpY2lhbCBjYXNoIHJhdGUiLCJtb25ldGFyeSBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IHJ1bnMgYSBidWRnZXQgZGVmaWNpdCB0byBzdGltdWxhdGUgdGhlIGVjb25vbXkiLCJmaXNjYWwgcG9saWN5Il0sWyJUaGUgY2VudHJhbCBiYW5rIHNlbGxzIGdvdmVybm1lbnQgYm9uZHMgdG8gcmVkdWNlIHRoZSBtb25leSBzdXBwbHkiLCJtb25ldGFyeSBwb2xpY3kiXSxbIlRoZSBnb3Zlcm5tZW50IGluY3JlYXNlcyB1bmVtcGxveW1lbnQgYmVuZWZpdHMiLCJmaXNjYWwgcG9saWN5Il0sWyJUaGUgY2VudHJhbCBiYW5rIGNoYW5nZXMgcmVzZXJ2ZSByZXF1aXJlbWVudHMgZm9yIGJhbmtzIiwibW9uZXRhcnkgcG9saWN5Il0sWyJUaGUgZ292ZXJubWVudCBjdXRzIGNvbXBhbnkgdGF4IHRvIGVuY291cmFnZSBpbnZlc3RtZW50IiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayBpbnRlcnZlbmVzIGluIGN1cnJlbmN5IG1hcmtldHMgdG8gaW5mbHVlbmNlIHRoZSBleGNoYW5nZSByYXRlIiwibW9uZXRhcnkgcG9saWN5Il0sWyJUaGUgZ292ZXJubWVudCBpbmNyZWFzZXMgc3BlbmRpbmcgb24gZWR1Y2F0aW9uIiwiZmlzY2FsIHBvbGljeSJdLFsiVGhlIGNlbnRyYWwgYmFuayByYWlzZXMgdGhlIGNhc2ggcmF0ZSB0byBzbG93IGluZmxhdGlvbiIsIm1vbmV0YXJ5IHBvbGljeSJdLFsiVGhlIGdvdmVybm1lbnQgcnVucyBhIGJ1ZGdldCBzdXJwbHVzIGJ5IGN1dHRpbmcgc3BlbmRpbmciLCJmaXNjYWwgcG9saWN5Il0sWyJUaGUgY2VudHJhbCBiYW5rIGxvd2VycyBpbnRlcmVzdCByYXRlcyB0byBlbmNvdXJhZ2UgYm9ycm93aW5nIiwibW9uZXRhcnkgcG9saWN5Il1d");
const STRUCTURES: [string, string][] = unpack("W1siaGFzIG1hbnkgc21hbGwgc2VsbGVycywgaWRlbnRpY2FsIHByb2R1Y3RzIGFuZCBmcmVlIGVudHJ5IGFuZCBleGl0IiwicGVyZmVjdCBjb21wZXRpdGlvbiJdLFsiaGFzIGEgc2luZ2xlIHNlbGxlciBhbmQgaGlnaCBiYXJyaWVycyB0byBlbnRyeSIsIm1vbm9wb2x5Il0sWyJpcyBkb21pbmF0ZWQgYnkgYSBmZXcgbGFyZ2UgZmlybXMgdGhhdCByZWFjdCB0byBlYWNoIG90aGVyJ3MgcHJpY2VzIiwib2xpZ29wb2x5Il0sWyJoYXMgbWFueSBzZWxsZXJzIG9mZmVyaW5nIGRpZmZlcmVudGlhdGVkIHByb2R1Y3RzIiwibW9ub3BvbGlzdGljIGNvbXBldGl0aW9uIl0sWyJpcyBiZXN0IGlsbHVzdHJhdGVkIGJ5IGEgbG9jYWwgd2F0ZXIgdXRpbGl0eSB3aXRoIG5vIGNvbXBldGl0b3JzIiwibW9ub3BvbHkiXSxbImlzIGJlc3QgaWxsdXN0cmF0ZWQgYnkgYSBzbWFsbCB3aGVhdCBtYXJrZXQgd2hlcmUgZmFybWVycyBhcmUgcHJpY2UgdGFrZXJzIiwicGVyZmVjdCBjb21wZXRpdGlvbiJdLFsiaXMgYmVzdCBpbGx1c3RyYXRlZCBieSBhIGdvdmVybm1lbnQtb3duZWQgZWxlY3RyaWNpdHkgZ3JpZCB3aXRoIG5vIHJpdmFscyIsIm1vbm9wb2x5Il0sWyJpcyBiZXN0IGlsbHVzdHJhdGVkIGJ5IGEgbWFya2V0IGZvciBmcmVzaCB2ZWdldGFibGVzIHdpdGggdGhvdXNhbmRzIG9mIHNpbWlsYXIgc21hbGwgZmFybXMiLCJwZXJmZWN0IGNvbXBldGl0aW9uIl0sWyJpcyBkb21pbmF0ZWQgYnkgdGhyZWUgb3IgZm91ciBiaWcgc3VwZXJtYXJrZXQgY2hhaW5zIiwib2xpZ29wb2x5Il0sWyJpcyBiZXN0IGlsbHVzdHJhdGVkIGJ5IHJlc3RhdXJhbnRzLCBlYWNoIG9mZmVyaW5nIGEgc2xpZ2h0bHkgZGlmZmVyZW50IG1lbnUgYW5kIGF0bW9zcGhlcmUiLCJtb25vcG9saXN0aWMgY29tcGV0aXRpb24iXSxbImlzIGJlc3QgaWxsdXN0cmF0ZWQgYnkgdGFwIHdhdGVyIHN1cHBsaWVkIGJ5IGEgc2luZ2xlIGNvdW5jaWwtb3duZWQgcHJvdmlkZXIiLCJtb25vcG9seSJdLFsibWVhbnMgbm8gc2luZ2xlIGZhcm1lciBjYW4gaW5mbHVlbmNlIHRoZSBwcmljZSBvZiB3aGVhdCIsInBlcmZlY3QgY29tcGV0aXRpb24iXSxbImlzIGRvbWluYXRlZCBieSBhIGZldyBsYXJnZSBtb2JpbGUgbmV0d29yayBwcm92aWRlcnMiLCJvbGlnb3BvbHkiXSxbImlzIGJlc3QgaWxsdXN0cmF0ZWQgYnkgaGFpcmRyZXNzZXJzLCBlYWNoIHdpdGggdGhlaXIgb3duIGJyYW5kIGFuZCBzdHlsZSIsIm1vbm9wb2xpc3RpYyBjb21wZXRpdGlvbiJdLFsiaXMgYmVzdCBpbGx1c3RyYXRlZCBieSBhIHBhdGVudGVkIG1lZGljaW5lIHdpdGggbm8gY29tcGV0aW5nIHByb2R1Y3RzIGFsbG93ZWQiLCJtb25vcG9seSJdLFsiaGFzIGEgaGFuZGZ1bCBvZiBhaXJsaW5lcyBzZXR0aW5nIHNpbWlsYXIgcHJpY2VzIiwib2xpZ29wb2x5Il0sWyJpbnZvbHZlcyBpZGVudGljYWwsIHVuZGlmZmVyZW50aWF0ZWQgZ3JhaW4gd2hlcmUgYnV5ZXJzIHNlZSBubyBkaWZmZXJlbmNlIGJldHdlZW4gc2VsbGVycyIsInBlcmZlY3QgY29tcGV0aXRpb24iXSxbImlzIGJlc3QgaWxsdXN0cmF0ZWQgYnkgY2xvdGhpbmcgYnJhbmRzIHRoYXQgZWFjaCB0cnkgdG8gZGlmZmVyZW50aWF0ZSB0aGVpciBwcm9kdWN0cyIsIm1vbm9wb2xpc3RpYyBjb21wZXRpdGlvbiJdLFsiaXMgYmVzdCBpbGx1c3RyYXRlZCBieSBwb3N0YWwgZGVsaXZlcnkgcnVuIGJ5IGEgc2luZ2xlIG5hdGlvbmFsIHByb3ZpZGVyIiwibW9ub3BvbHkiXSxbImlzIGRvbWluYXRlZCBieSB0d28gbWFqb3Igc29mdCBkcmluayBicmFuZHMiLCJvbGlnb3BvbHkiXV0=");
const TAXES: [string, string][] = unpack("W1siVGF4IG9uIHdhZ2VzIGFuZCBzYWxhcmllcyIsImRpcmVjdCB0YXgiXSxbIlRheCBvbiBjb21wYW55IHByb2ZpdHMiLCJkaXJlY3QgdGF4Il0sWyJUYXggYWRkZWQgdG8gdGhlIHByaWNlIG9mIGdvb2RzIGFuZCBzZXJ2aWNlcyIsImluZGlyZWN0IHRheCJdLFsiVGF4IG9uIGltcG9ydGVkIGdvb2RzIiwiaW5kaXJlY3QgdGF4Il0sWyJFeGNpc2UgZHV0eSBvbiBmdWVsIiwiaW5kaXJlY3QgdGF4Il0sWyJUYXggb24gcGVyc29uYWwgaW52ZXN0bWVudCBpbmNvbWUiLCJkaXJlY3QgdGF4Il0sWyJDb21wYW55IHRheCBwYWlkIG9uIGJ1c2luZXNzIHByb2ZpdHMiLCJkaXJlY3QgdGF4Il0sWyJHb29kcyBhbmQgU2VydmljZXMgVGF4IChHU1QpIGFkZGVkIGF0IHRoZSBjaGVja291dCIsImluZGlyZWN0IHRheCJdLFsiQ2FwaXRhbCBnYWlucyB0YXggb24gdGhlIHNhbGUgb2YgYW4gaW52ZXN0bWVudCBwcm9wZXJ0eSIsImRpcmVjdCB0YXgiXSxbIkluaGVyaXRhbmNlIHRheCBwYWlkIG9uIGFuIGVzdGF0ZSIsImRpcmVjdCB0YXgiXSxbIlZhbHVlLWFkZGVkIHRheCBpbmNsdWRlZCBpbiB0aGUgcHJpY2Ugb2YgYSByZXN0YXVyYW50IG1lYWwiLCJpbmRpcmVjdCB0YXgiXSxbIlRheCBkZWR1Y3RlZCBkaXJlY3RseSBmcm9tIGFuIGVtcGxveWVlJ3MgcGF5IiwiZGlyZWN0IHRheCJdLFsiVG9iYWNjbyBleGNpc2UgYWRkZWQgdG8gdGhlIHByaWNlIG9mIGNpZ2FyZXR0ZXMiLCJpbmRpcmVjdCB0YXgiXSxbIlRheCBwYWlkIGJ5IGEgY29tcGFueSBiYXNlZCBvbiBpdHMgYW5udWFsIHByb2ZpdCIsImRpcmVjdCB0YXgiXSxbIkFsY29ob2wgZXhjaXNlIGluY2x1ZGVkIGluIHRoZSBwcmljZSBvZiBhIGJvdHRsZSBvZiB3aW5lIiwiaW5kaXJlY3QgdGF4Il0sWyJMYW5kIHRheCBwYWlkIGJ5IGEgcHJvcGVydHkgb3duZXIiLCJkaXJlY3QgdGF4Il0sWyJJbXBvcnQgdGFyaWZmIGNoYXJnZWQgb24gZm9yZWlnbiBjYXJzIiwiaW5kaXJlY3QgdGF4Il0sWyJUYXggb24gYW4gaW5kaXZpZHVhbCdzIHBlcnNvbmFsIGluY29tZSIsImRpcmVjdCB0YXgiXSxbIlNhbGVzIHRheCBjaGFyZ2VkIG9uIGEgcmV0YWlsIHB1cmNoYXNlIiwiaW5kaXJlY3QgdGF4Il0sWyJBIGdvdmVybm1lbnQgbGV2eSBkZWR1Y3RlZCBmcm9tIHdhZ2VzIHRvIGZ1bmQgcHVibGljIGhlYWx0aCBjYXJlIiwiZGlyZWN0IHRheCJdXQ==");

const SYSTEM_MEANING: Record<string, string> = {
  "market economy": "lets prices and competition in private markets decide what is produced",
  "command economy": "has the government plan what is produced",
  "mixed economy": "combines private markets with government involvement",
  "traditional economy": "relies on custom and tradition to decide what is produced",
};
const FACTOR_MEANING: Record<string, string> = {
  land: "natural resources such as farmland, minerals and water",
  labour: "the work people do",
  capital: "man-made tools, machines and buildings used to produce goods",
  enterprise: "the risk-taking and organising that starts and runs a business",
};
const POLICY_MEANING: Record<string, string> = {
  "fiscal policy": "uses government spending and taxes",
  "monetary policy": "uses interest rates and the money supply, and is run by the central bank",
};
const TAX_MEANING: Record<string, string> = {
  "direct tax": "is paid straight to the government by the person or company earning the income",
  "indirect tax": "is added to the price of goods and services, so it is paid by whoever buys them",
};

const EXPLAIN: Record<string, (item: string, answer: string) => string> = {
  "supply-demand": (_s, a) =>
    `Price rises when demand goes up or supply goes down, and falls when demand goes down or supply goes up. Here the result is that ${a}.`,
  "economic-systems": (_d, a) => `A ${a} ${SYSTEM_MEANING[a]}.`,
  "factors-of-production": (i, a) => `"${i}" is ${a}. ${a[0].toUpperCase()}${a.slice(1)} means ${FACTOR_MEANING[a]}.`,
  "policy-tools": (i, a) => `"${i}" is ${a}, which ${POLICY_MEANING[a]}.`,
  "market-structures": (d, a) => `The description "${d}" points to ${a === "monopoly" ? "a monopoly" : a === "oligopoly" ? "an oligopoly" : a}.`,
  "tax-types": (t, a) => `"${t}" is a ${a}. A ${a} ${TAX_MEANING[a]}.`,
};

function bankTopic(
  id: string,
  label: string,
  bank: [string, string][],
  prompt: (item: string) => string,
  pool: string[],
): Topic {
  return bankMCQ(
    id,
    label,
    bank.map(([item, answer]) => ({ prompt: prompt(item), answer, explanation: EXPLAIN[id]?.(item, answer) })),
    pool,
  );
}

// ---------- Grades 9-10 ----------

function supplyAndDemand(): Topic {
  return bankTopic(
    "supply-demand",
    "Supply and demand",
    SUPPLY_DEMAND,
    (s) => `What is the likely effect on the equilibrium price? ${s}`,
    ["price rises", "price falls"],
  );
}

function economicSystems(): Topic {
  return bankTopic("economic-systems", "Economic systems", SYSTEMS, (d) => `Which type of economic system ${d}?`, [
    "market economy",
    "command economy",
    "mixed economy",
    "traditional economy",
  ]);
}

function factorsOfProduction(): Topic {
  return bankTopic(
    "factors-of-production",
    "Factors of production",
    FACTORS,
    (i) => `Which factor of production is this? "${i}"`,
    ["land", "labour", "capital", "enterprise"],
  );
}

function opportunityCost(): Topic {
  return {
    id: "opportunity-cost",
    label: "Opportunity cost",
    generate: () => {
      const wage = randInt(10, 40);
      const hours = randInt(2, 8);
      return {
        prompt: `Sam can work ${hours} hours at $${wage} per hour, or go to a free concert instead. What is the opportunity cost of going to the concert?`,
        answer: `$${wage * hours}`,
        explanation: `Opportunity cost is the value of the best alternative given up. Working ${hours} hours at $${wage} an hour earns ${hours} × $${wage} = $${wage * hours}.`,
      };
    },
  };
}

function inflationRate(): Topic {
  return {
    id: "inflation-rate",
    label: "Inflation rate",
    generate: () => {
      const before = randInt(2, 20) * 100;
      const pct = pick([2, 3, 4, 5, 10]);
      return {
        prompt: `A basket of goods cost $${before} last year and $${(before * (100 + pct)) / 100} this year. Calculate the inflation rate.`,
        answer: `${pct}%`,
        explanation: `Inflation rate = (new price - old price) ÷ old price × 100 = ($${(before * (100 + pct)) / 100} - $${before}) ÷ $${before} × 100 = ${pct}%.`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function priceElasticity(): Topic {
  return {
    id: "price-elasticity",
    label: "Price elasticity of demand",
    generate: () => {
      const pricePct = pick([5, 10, 15, 20, 25]);
      const ped = pick([0.5, 1, 1.5, 2, 3]);
      return {
        prompt: `The price of a good rises by ${pricePct}% and the quantity demanded falls by ${pricePct * ped}%. Calculate the price elasticity of demand (ignore the sign, to 1 decimal place).`,
        answer: ped.toFixed(1),
        explanation: `PED = % change in quantity demanded ÷ % change in price = ${pricePct * ped} ÷ ${pricePct} = ${ped.toFixed(1)}.`,
      };
    },
  };
}

function elasticityInterpretation(): Topic {
  return {
    id: "elasticity-interpretation",
    label: "Elastic and inelastic demand",
    generate: () => {
      const ped = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.5, 1.8, 2, 2.5, 3, 4]);
      const answer = ped < 1 ? "inelastic" : ped === 1 ? "unit elastic" : "elastic";
      return {
        prompt: `A good has a price elasticity of demand of ${ped.toFixed(1)}. Is demand elastic, inelastic or unit elastic?`,
        answer,
        explanation: `${ped < 1 ? "A PED below 1 means demand is inelastic: quantity changes by less than the price does" : ped === 1 ? "A PED of exactly 1 means demand is unit elastic: quantity changes by the same percentage as price" : "A PED above 1 means demand is elastic: quantity changes by more than the price does"}. Here PED = ${ped.toFixed(1)}, so demand is ${answer}.`,
        options: ["elastic", "inelastic", "unit elastic"],
      };
    },
  };
}

function economicGrowth(): Topic {
  return {
    id: "economic-growth",
    label: "Economic growth rate",
    generate: () => {
      const before = randInt(1, 20) * 100;
      const pct = pick([2, 3, 4, 5]);
      return {
        prompt: `Real GDP grew from $${before} billion to $${(before * (100 + pct)) / 100} billion. Calculate the percentage growth rate.`,
        answer: `${pct}%`,
        explanation: `Growth rate = (new GDP - old GDP) ÷ old GDP × 100 = ($${(before * (100 + pct)) / 100} - $${before}) ÷ $${before} × 100 = ${pct}%.`,
      };
    },
  };
}

function unemploymentRate(): Topic {
  return {
    id: "unemployment-rate",
    label: "Unemployment rate",
    generate: () => {
      const labourForce = randInt(10, 100) * 1000;
      const pct = pick([3, 4, 5, 6, 8, 10]);
      const unemployed = (labourForce * pct) / 100;
      return {
        prompt: `An economy has ${labourForce - unemployed} people employed and ${unemployed} people unemployed. What is the unemployment rate?`,
        answer: `${pct}%`,
        explanation: `Labour force = employed + unemployed = ${labourForce - unemployed} + ${unemployed} = ${labourForce}. Unemployment rate = unemployed ÷ labour force × 100 = ${unemployed} ÷ ${labourForce} × 100 = ${pct}%.`,
      };
    },
  };
}

function policyTools(): Topic {
  return bankTopic(
    "policy-tools",
    "Fiscal and monetary policy",
    POLICY,
    (a) => `Is this fiscal policy or monetary policy? "${a}"`,
    ["fiscal policy", "monetary policy"],
  );
}

function marketStructures(): Topic {
  return bankTopic("market-structures", "Market structures", STRUCTURES, (d) => `Which market structure ${d}?`, [
    "perfect competition",
    "monopoly",
    "oligopoly",
    "monopolistic competition",
  ]);
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

const MULTIPLIERS: [number, number][] = [
  [0.5, 2],
  [0.75, 4],
  [0.8, 5],
  [0.9, 10],
];

function multiplierEffect(): Topic {
  return {
    id: "multiplier",
    label: "The multiplier effect",
    generate: () => {
      const [mpc, multiplier] = pick(MULTIPLIERS);
      const injection = randInt(1, 20) * 10;
      return {
        prompt: `The marginal propensity to consume is ${mpc}. Government spending rises by $${injection} million. What is the total change in national income?`,
        answer: `$${injection * multiplier} million`,
        explanation: `Multiplier = 1 ÷ (1 - MPC) = 1 ÷ (1 - ${mpc}) = ${multiplier}. Change in national income = $${injection} million × ${multiplier} = $${injection * multiplier} million.`,
      };
    },
  };
}

function realGdp(): Topic {
  return {
    id: "real-gdp",
    label: "Real vs nominal GDP",
    generate: () => {
      const deflator = pick([110, 120, 125, 150, 200]);
      const real = randInt(2, 30) * 100;
      return {
        prompt: `Nominal GDP is $${(real * deflator) / 100} billion and the GDP deflator is ${deflator}. What is real GDP?`,
        answer: `$${real} billion`,
        explanation: `Real GDP = nominal GDP ÷ deflator × 100 = $${(real * deflator) / 100} ÷ ${deflator} × 100 = $${real} billion.`,
      };
    },
  };
}

function comparativeAdvantage(): Topic {
  return {
    id: "comparative-advantage",
    label: "Comparative advantage",
    generate: () => {
      let a1: number, a2: number, b1: number, b2: number;
      do {
        a1 = pick([10, 20, 30]);
        b1 = pick([10, 20, 30]);
        a2 = randInt(1, 6) * 10;
        b2 = randInt(1, 6) * 10;
      } while (a2 * b1 === b2 * a1);
      // The country giving up fewer units of Y per unit of X has the comparative advantage in X.
      const answer = a2 * b1 < b2 * a1 ? "Country A" : "Country B";
      return {
        prompt: `In a day, Country A can produce ${a1} units of X or ${a2} units of Y. Country B can produce ${b1} units of X or ${b2} units of Y. Which country has the comparative advantage in producing X?`,
        answer,
        explanation: `The opportunity cost of one unit of X is the Y given up. Country A gives up ${a2}/${a1} = ${+(a2 / a1).toFixed(2)} units of Y; Country B gives up ${b2}/${b1} = ${+(b2 / b1).toFixed(2)}. The country with the lower opportunity cost has the comparative advantage: ${answer}.`,
        options: ["Country A", "Country B"],
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function exchangeRates(): Topic {
  return {
    id: "exchange-rates",
    label: "Exchange rates",
    generate: () => {
      const rate = pick([0.5, 0.8, 1.5, 2]);
      const dollars = randInt(1, 50) * 10;
      return {
        prompt: `The exchange rate is 1 US dollar = ${rate} units of foreign currency. How many units of foreign currency will you receive for $${dollars}?`,
        answer: (dollars * rate).toFixed(2),
        explanation: `Foreign currency = dollars × exchange rate = ${dollars} × ${rate} = ${(dollars * rate).toFixed(2)}.`,
      };
    },
  };
}

function taxTypes(): Topic {
  return bankTopic("tax-types", "Direct and indirect taxes", TAXES, (t) => `Is this a direct tax or an indirect tax? "${t}"`, [
    "direct tax",
    "indirect tax",
  ]);
}

function tradeBalance(): Topic {
  return {
    id: "trade-balance",
    label: "Trade balance",
    generate: () => {
      const exports = randInt(10, 90);
      const imports = exports + pick([-1, 1]) * randInt(1, 9);
      return {
        prompt: `A country exports $${exports} billion and imports $${imports} billion of goods. Is there a trade surplus or a trade deficit?`,
        answer: exports > imports ? "surplus" : "deficit",
        explanation: `Trade balance = exports - imports = $${exports} - $${imports} = ${exports - imports < 0 ? "-" : ""}$${Math.abs(exports - imports)} billion. A positive balance is a surplus and a negative balance is a deficit, so this is a ${exports > imports ? "surplus" : "deficit"}.`,
        options: ["surplus", "deficit"],
      };
    },
  };
}

function baseEconomicsTopics(grade: number): Topic[] {
  if (grade <= 10) {
    return [supplyAndDemand(), economicSystems(), factorsOfProduction(), opportunityCost(), inflationRate()];
  }
  return [
    priceElasticity(),
    elasticityInterpretation(),
    economicGrowth(),
    unemploymentRate(),
    policyTools(),
    marketStructures(),
  ];
}

/** "Advanced" pulls in the next band's topics; the top band gets genuinely new extension topics. */
function advancedEconomicsExtras(grade: number): Topic[] {
  if (grade <= 10) return [priceElasticity(), marketStructures()];
  return [multiplierEffect(), realGdp(), comparativeAdvantage()];
}

function cambridgeEconomicsExtras(grade: number): Topic[] {
  return grade >= 9 ? [exchangeRates(), taxTypes(), tradeBalance()] : [];
}

export function getEconomicsTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = [...baseEconomicsTopics(grade), ...moreEconomicsTopics(grade), economicsWordProblems(grade)];
  const advanced = difficulty === "advanced" ? advancedEconomicsExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeEconomicsExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
