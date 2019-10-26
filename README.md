# faybler-express
Language learning through fables

### Setup for development
 - This application requires a .env file in the root directory as below.
 ```
 PORT=9000
 ```
 - a folder named 'dist' will also need to be created in the root directory which will contain the compiled typescript code.

 ### Setup for production
 - This application requires an app.yaml file in the root directory such as the one below to run on google app engine.
 ```
runtime: nodejs10

env_variables:
  TEST: "test value"

handlers:
- url: /.*
  secure: always
  redirect_http_response_code: 301
  script: auto
 ```

 - A .gcloudignore file in the root directory is also recommended to prevent gcloud from uploading development files
 ```
# Repository files
.git
.gitignore
README.md

# Files used for development only
.env
.eslintrc.js

# Node.js dependencies:
node_modules/
 ```

 - A cloudbuild.json file such as the one below can be used to deploy to google app engine using google cloud build. N.B a storage bucket in google cloud will also need to be created and added to the "logsBucket" property. The cloudbuild.json file should be placed in the root folder.
 ```
 {
    "steps": [
        {
            "name": "gcr.io/cloud-builders/npm",
            "args": ["install"]
        },
        {
            "name": "gcr.io/cloud-builders/npm",
            "args": ["run", "build"]
        },
        {
            "name": "gcr.io/cloud-builders/gcloud",
            "args": ["app", "deploy"]
        }
    ],
    "logsBucket": "gs://your-google-cloud-bucket-goes-here"
}
```

