const domainRegex = /^(?:[a-zA-Z0-9][a-zA-Z0-9-]{0,62}\.)+[a-zA-Z]{2,63}$/;

export function validateDomain(domain: string): boolean {
  if (!domain) return false;

  if (domain.length < 1 || domain.length > 253) {
    return false;
  }

  if (
    domain.startsWith("-") ||
    domain.endsWith("-") ||
    domain.startsWith("http") ||
    domain.startsWith("https") ||
    domain.startsWith("www")
  ) {
    return false;
  }

  return domainRegex.test(domain);
}
