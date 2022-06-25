export const getInitials = (string: string | null | undefined) => {
  let names = String(string || "").split(" ");
  let initials = names[0]?.substring(0, 1).toUpperCase();

  if (names.length > 1) {
    const sub = names[names.length - 1] ?? "";
    initials += sub.substring(0, 1).toUpperCase();
  }
  return initials;
};

export const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from =
    "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  var to =
    "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, "")
    // Collapse whitespace and replace by -
    .replace(/\s+/g, "-")
    // Collapse dashes
    .replace(/-+/g, "-");

  return str;
};

export const formatAmount = (
  unit_amount: number | bigint | null,
  currency: string = "aud"
) => {
  if (unit_amount === null) return;

  const amount = Number(unit_amount) / 100;

  return new Intl.NumberFormat(navigator.language || "en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const toDateTime = (secs: number | null) => {
  if (!secs) {
    return;
  }
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
