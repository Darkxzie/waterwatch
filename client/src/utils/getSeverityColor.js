const colors = {
  LOW: 'bg-low/20 text-low',
  MEDIUM: 'bg-medium/20 text-amber-700',
  HIGH: 'bg-high/20 text-high',
  CRITICAL: 'bg-critical/20 text-critical'
};

export function getSeverityColor(severity = 'MEDIUM') {
  return colors[severity] || colors.MEDIUM;
}
