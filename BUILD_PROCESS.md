# Build Process

The GitHub Actions workflow at `.github/workflows/build-and-package.yml` builds all deployable projects after a push to `dev`, `pilot`, or `main`, or from **Actions > Build and Package > Run workflow**.

## Artifacts

Each successful run uploads one artifact with this layout:

```text
artifacts/
  web/       # xom-truyen/dist
  admin/     # xmtruyen-admin/dist
  api/       # dotnet publish -c Release
  build-info.txt
```

## Environments

- `dev`: separate database and API URL. Use the `dev` branch or dispatch with `dev`.
- `pilot`: a controlled, sanitized clone of production data. Never point pilot at the production database.
- `production`: real data. Use the `main` branch and protect the GitHub Environment with required reviewers.

Create GitHub Environments named `dev`, `pilot`, and `production`. Each environment should hold its own API/database/deployment secrets. Do not put connection strings or deployment tokens in the admin UI or repository.

Optional environment variables:

- `AUTO_BUILD=false`: disable push-triggered builds for that environment. Push builds are enabled by default.
- `AUTO_DEPLOY=true`: pass the deployment gate after a successful build. The actual provider-specific deploy command must be added to the workflow after its hosting and secret contract is decided.

The admin **Build Process** page stores operator preferences and local pipeline notes in browser storage. It does not receive GitHub tokens and cannot directly change GitHub Actions settings.