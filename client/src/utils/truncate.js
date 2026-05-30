export function truncate(value, max = 120) {
  if (!value || value.length <= max) {
    return value;
  }

  return `${value.slice(0, max)}...`;
}
