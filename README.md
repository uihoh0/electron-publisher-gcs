# electron-publisher-gcs
[![Build Status](https://travis-ci.org/FNCxPro/electron-publisher-gcs.svg?branch=master)](https://travis-ci.org/FNCxPro/electron-publisher-gcs)
 
electron-builder Google Cloud Storage bucket publisher (because GCS's S3-compat API doesn't support the S3 publisher)

Heavily inspired by @zalewskip123's [electron-publisher-simple-http](https://github.com/zalewskip123/electron-publisher-simple-http/)

## How to Use
Install `electron-publisher-gcs` through your package manager (yarn, npm, pnpm, etc...)
Next, set your publish provider to `gcs`.
Add a new root object `publish-gcs` to your package.json. (see [publish-gcs object](#publish-gcs-object))
```jsonc
// Your package.json file
{
  "name": "cool-app",
  "build": {
    "appId": "app.cool",
    "compression": "normal",
    "productName": "Cool App",
    "win": {
      "target": "nsis",
      "publish": [
        {
          "provider": "generic",
          "url": "https://releases.cool.app/${name}/${os}/${arch}/"
        },
        "gcs"
      ]
    }
  },
  "publish-gcs": {
    "bucket": "releases.cool.app", // Your GCS bucket
    "path": "/${name}/${os}/${arch}/${filename}",
    "serviceAccount": "D:\\cool-app\\secrets\\service-account.json",
    "public": true,
    "resumable": true
  }
}
```

## `publish-gcs` object
```json
{
  "bucket": "releases.cool.app",
  "path": "/${name}/${os}/${arch}/${filename}",
  "serviceAccount": "D:\\cool-app\\secrets\\service-account.json",
  "public": true,
  "resumable": true
}
```
### `bucket`
Type: `string`

The Google Cloud Storage bucket name

Examples:
```
releases.cool.app
```
```
cool-app-releases
```
Both can be accessible from {bucket_name}.storage.googleapis.com.

### `path`
Type: `string`  
Default: `/${name}/${os}/${arch}/${filename}`

* `name`: the app's name (from electron-builder)  
* `os`: `task.packager.platform.name`  
* `arch`: Architecture  
* `filename`: The filename of the file being uploaded

Example:
```
/${name}/${os}/${arch}/${filename}
```

### `serviceAccount`
Type: `string` or `object`

Path to a service account JSON file or an object containing the JSON content as an object

Examples:
```
D:\\cool-app\\secrets\\service-account.json
```
```json
{
  "type": "service_account",
  "project_id": "cool-app-xxxxxx",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxxxxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@cool-app-xxxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40cool-app-xxxxxx.iam.gserviceaccount.com"
}
```

### `public`
Type: `boolean`  
Default: `true`

See [Bucket#upload](https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/Bucket#upload) (options.public)

### `resumable`
Type: `boolean`  
Default: `true`

See [Bucket#upload](https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/Bucket#upload) (options.resumable)