export const spokaneServiceZipCodes = [
  '99201',
  '99224',
  '99203',
  '99223',
  '99208',
  '99205',
  '99206',
  '99212',
  '99216',
  '99037',
] as const;

const spokaneServiceZipCodeSet = new Set<string>(spokaneServiceZipCodes);

export function isSupportedSpokaneZip(value: string | undefined) {
  return Boolean(value && /^\d{5}$/.test(value) && spokaneServiceZipCodeSet.has(value));
}
