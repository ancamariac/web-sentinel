const url = require("url");

function countDots(urlString) {
  return (urlString.match(/\./g) || []).length;
}

function getSubdomainLevel(urlString) {
  const parsedUrl = new URL(urlString);
  const subdomains = parsedUrl.hostname.split(".");
  if (subdomains[0].toLowerCase() === "www") {
    subdomains.shift();
  }
  subdomains.pop(); // Remove the top-level domain
  return subdomains.length;
}

function getPathLevel(urlString) {
  const parsedUrl = new URL(urlString);
  const pathComponents = parsedUrl.pathname
    .split("/")
    .filter((component) => component);
  return pathComponents.length;
}

function getUrlLength(urlString) {
  return urlString.length;
}

function countDashes(urlString) {
  return (urlString.match(/-/g) || []).length;
}

function countDashesInHostname(urlString) {
  const parsedUrl = new URL(urlString);
  return (parsedUrl.hostname.match(/-/g) || []).length;
}

function countAtSymbol(urlString) {
  return (urlString.match(/@/g) || []).length;
}

function countTildeSymbol(urlString) {
  return (urlString.match(/~/g) || []).length;
}

function countUnderscoreSymbol(urlString) {
  return (urlString.match(/_/g) || []).length;
}

function countPercentSymbol(urlString) {
  return (urlString.match(/%/g) || []).length;
}

function countQueryComponents(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.searchParams.toString().split("&").length || 0;
}

function countAmpersandSymbol(urlString) {
  return (urlString.match(/&/g) || []).length;
}

function countHashSymbol(urlString) {
  return (urlString.match(/#/g) || []).length;
}

function countNumericCharacters(urlString) {
  return (urlString.match(/\d/g) || []).length;
}

function checkHttps(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.protocol === "https:";
}

function checkIpAddress(urlString) {
  const parsedUrl = new URL(urlString);
  return /^[0-9.]+$/.test(parsedUrl.hostname);
}

function checkDomainInSubdomains(urlString) {
  const parsedUrl = new URL(urlString);
  const parts = parsedUrl.hostname.split(".");
  const domain = parts.pop();
  return parts.includes(domain);
}

function checkDomainInPath(urlString) {
  const parsedUrl = new URL(urlString);
  const domain = parsedUrl.hostname.split(".").pop();
  return parsedUrl.pathname.includes(domain);
}

function countHostnameLength(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.hostname.length;
}

function countPathLength(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.pathname.length;
}

function countQueryLength(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.search.length;
}

function checkDoubleSlashInPaths(urlString) {
  const parsedUrl = new URL(urlString);
  return parsedUrl.pathname.includes("//");
}

function checkExtFavicon(urlString) {
  return urlString.includes("favicon");
}

function checkInsecureForms(urlString) {
  return urlString.includes("forms");
}

function featureExtraction(urlString) {
  return [
    countDots(urlString),
    getSubdomainLevel(urlString),
    getPathLevel(urlString),
    getUrlLength(urlString),
    countDashes(urlString),
    countDashesInHostname(urlString),
    countAtSymbol(urlString),
    countTildeSymbol(urlString),
    countUnderscoreSymbol(urlString),
    countPercentSymbol(urlString),
    countQueryComponents(urlString),
    countAmpersandSymbol(urlString),
    countHashSymbol(urlString),
    countNumericCharacters(urlString),
    checkHttps(urlString) ? 1 : 0,
    checkIpAddress(urlString) ? 1 : 0,
    checkDomainInSubdomains(urlString) ? 1 : 0,
    checkDomainInPath(urlString) ? 1 : 0,
    countHostnameLength(urlString),
    countPathLength(urlString),
    countQueryLength(urlString),
    checkDoubleSlashInPaths(urlString) ? 1 : 0,
    checkExtFavicon(urlString) ? 1 : 0,
    checkInsecureForms(urlString) ? 1 : 0,
  ];
}

module.exports = { featureExtraction }; 