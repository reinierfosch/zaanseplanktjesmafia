# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by emailing info@plankjesmaffia.nl.

## Secret Management

### Environment Variables

This project uses environment variables for sensitive configuration. **NEVER** commit actual credentials to Git.

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env`

3. Verify `.env` is in `.gitignore` (it should be by default)

### What NOT to Commit

- ❌ Database passwords
- ❌ SMTP/Email passwords
- ❌ Admin passwords
- ❌ API keys
- ❌ Any `.env` files with real credentials

### If You Accidentally Commit Secrets

1. **Immediately rotate** all exposed credentials
2. Remove secrets from Git history using tools like:
   - `git-filter-repo`
   - `BFG Repo-Cleaner`
3. Force push the cleaned repository
4. Notify all team members

### Best Practices

- Use strong, unique passwords for each service
- Enable 2FA where available
- Regularly rotate credentials
- Use environment variables for all sensitive data
- Review commits before pushing to ensure no secrets are included

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Updates

Security updates will be released as needed. Please keep your installation up to date.
