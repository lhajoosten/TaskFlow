# Development SSL Setup

## Prerequisites

- OpenSSL installed
- Node.js and Angular CLI
- PowerShell access

## Create SSL configuration file

Make a new directory in the root dir

```
mkdir ssl
```

create a new config file called `localhost.conf`

add this to the config file

```powershell
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = YourCountry
ST = YourState
L = YourCity
O = YourOrganization
OU = YourUnit
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
```

## SSL Certificate Generation

Store this script in `scripts/generate-ssl.ps1`:

```powershell
$sslPath = "G:\TaskFlow\src\TaskFlow.Web\ssl"
$certsPath = "G:\TaskFlow\src\TaskFlow.Web\.angular-certs"

New-Item -ItemType Directory -Force -Path $sslPath
New-Item -ItemType Directory -Force -Path $certsPath

Set-Location $sslPath
$env:OPENSSL_CONF = "$sslPath\localhost.conf"
openssl req -new -x509 -nodes -days 365 -keyout "$certsPath\localhost.key" -out "$certsPath\localhost.crt" -config localhost.conf
```

## Proxy Configuration

Create `src/proxy.conf.json`:

```json
{
  "/api": {
    "target": "https://localhost:<CLIENT_HTTPS_PORT>",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "headers": {
      "Connection": "keep-alive"
    },
    "pathRewrite": {
      "^/api": "/api"
    }
  }
}
```

## Angular Configuration

Update your `angular.json` to include SSL and proxy settings:

```json
{
  "projects": {
    "TaskFlow.Web": {
      "architect": {
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "TaskFlow.Web:build",
            "port": 4443,
            "ssl": true,
            "sslCert": ".angular-certs/localhost.crt",
            "sslKey": ".angular-certs/localhost.key",
            "proxyConfig": "src/proxy.conf.json"
          },
          "configurations": {
            "production": {
              "browserTarget": "TaskFlow.Web:build:production"
            },
            "development": {
              "browserTarget": "TaskFlow.Web:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

## NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "ng serve",
    "start:ssl": "ng serve --ssl --ssl-cert .angular-certs/localhost.crt --ssl-key .angular-certs/localhost.key",
    "start:ssl:prod": "ng serve --ssl --ssl-cert .angular-certs/localhost.crt --ssl-key .angular-certs/localhost.key --configuration production",
    "ssl:setup": "powershell -ExecutionPolicy Bypass -File .\\scripts\\generate-ssl.ps1",
    "ssl:clean": "rimraf .angular-certs",
    "ssl:reset": "npm run ssl:clean && npm run ssl:setup"
  }
}
```

Now you can run these commands:

- `npm run ssl:setup` - Generate new SSL certificates
- `npm run start:ssl` - Start dev server with SSL
- `npm run ssl:reset` - Clean and regenerate certificates

> Note: Install rimraf as a dev dependency if not already present:

```bash
npm install --save-dev rimraf
```

## Running the Development Server

```powershell
# Generate certificates
.\scripts\generate-ssl.ps1

# Start Angular server
ng serve
```
