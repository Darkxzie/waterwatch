# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1.0 | No        |

## Reporting a Vulnerability

Please do not open public issues for security-sensitive reports.

Send a report to the maintainers through a private channel with:

- a clear summary of the issue
- affected version or commit
- reproduction steps or proof of concept
- impact assessment
- any suggested remediation

If no private contact is available in the fork or deployment using this repository, open a minimal issue requesting a secure contact path without disclosing exploit details.

## Disclosure Process

The maintainers will:

1. Acknowledge receipt within 3 business days.
2. Provide an initial triage assessment within 7 business days.
3. Share a remediation plan or request more information within 14 business days.
4. Coordinate disclosure after a fix is available or mitigation guidance is ready.

## Response Expectations

- Critical issues: target mitigation or patch guidance within 7 days.
- High severity issues: target fix or mitigation within 14 days.
- Medium and low severity issues: target fix in the next scheduled release cycle.

## Scope

This policy applies to:

- the Node.js workspace packages in this repository
- CI/CD configuration shipped with this repository
- deployment artifacts built directly from this repository

Third-party services, infrastructure, and downstream deployments are out of scope unless the repository configuration directly introduces the issue.
