# Security Policy

## 🛡️ Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🚨 Reporting a Vulnerability

We take the security of Green Mission seriously. If you believe you have found a security vulnerability, please report it to us through coordinated disclosure.

### ⚠️ Please do NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.

Instead, please send an email to: **security@madezmedia.com**

### 📧 What to Include in Your Report

Please include as much of the following information as possible:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting)
- **Full paths of source file(s)** related to the manifestation of the issue
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Special configuration** required to reproduce the issue
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

### 🕐 Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with our assessment
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### 🎯 What to Expect

After submitting a report, you can expect:

1. **Acknowledgment** of your report within 48 hours
2. **Regular updates** on our progress toward a fix
3. **Credit** for the discovery (if desired) when the vulnerability is announced
4. **Coordination** on the disclosure timeline

## 🔒 Security Best Practices

### For Users

- Keep your dependencies updated
- Use environment variables for sensitive configuration
- Never commit API keys or secrets to the repository
- Use HTTPS in production
- Regularly audit your Airtable permissions
- Review Clerk organization access regularly

### For Contributors

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication and authorization
- Keep dependencies updated
- Use environment variables for configuration

## 🛠️ Security Features

Green Mission implements several security measures:

### Authentication & Authorization
- **Clerk Authentication**: Industry-standard authentication service
- **Organization-based Access**: Multi-tenant security model
- **Role-based Permissions**: Admin and member roles
- **API Key Management**: Secure Airtable API integration

### Data Protection
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Built-in Next.js CSRF protection
- **SQL Injection Prevention**: Airtable API prevents SQL injection

### Infrastructure Security
- **HTTPS Enforcement**: All traffic encrypted in transit
- **Secure Headers**: Security headers implemented
- **Dependency Scanning**: Regular security audits
- **Webhook Verification**: Stripe and Clerk webhook verification

## 🚫 Out of Scope

The following issues are generally considered out of scope:

- **Rate limiting bypass** (unless it leads to resource exhaustion)
- **Social engineering attacks**
- **Physical attacks**
- **Attacks requiring physical access** to user devices
- **Denial of Service attacks**
- **Issues in third-party dependencies** (please report directly to the maintainer)

## 🏆 Recognition

We believe in recognizing security researchers who help us keep Green Mission secure:

- **Hall of Fame**: Public recognition on our security page (with permission)
- **Swag**: Green Mission branded items for significant findings
- **Early Access**: Beta access to new features
- **Direct Communication**: Access to our development team

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Clerk Security](https://clerk.com/docs/security)
- [Airtable Security](https://airtable.com/security)

## 📞 Contact Information

- **Security Team**: security@madezmedia.com
- **General Contact**: hello@madezmedia.com
- **Website**: https://madezmedia.com

## 📄 Legal

This security policy is subject to our [Terms of Service](https://madezmedia.com/terms) and [Privacy Policy](https://madezmedia.com/privacy).

---

**Thank you for helping keep Green Mission and our community safe! 🛡️**