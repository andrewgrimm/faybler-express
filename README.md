# faybler-express
Language learning through fables

### Setup for development
 - This application requires a .env file in the root directory as below
 ```
 PORT=9000
 ```
 - a folder named 'dist' will also need to be created in the root directory which will contain the compiled typescript code.

 ### Setup for production
 - This application requires an app.yaml file in the root directory such as the one below to run on google app engine.
 ```
# Copyright 2017, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_quickstart_yaml]
runtime: nodejs10
# [END gae_quickstart_yaml]
 ```

 - A .gcloudignore file in the root directory is also recommended to prevent gcloud from uploading uncompiled code and development files
 ```
 # This file specifies files that are *not* uploaded to Google Cloud Platform
# using gcloud. It follows the same syntax as .gitignore, with the addition of
# "#!include" directives (which insert the entries of the given .gitignore-style
# file at that point).
#
# For more information, run:
#   $ gcloud topic gcloudignore
#
.gcloudignore
# If you would like to upload your .git directory, .gitignore file or files
# from your .gitignore file, remove the corresponding line
# below:
.git
.gitignore
README.md

# un-compiled source code need not be uploaded
src/
tsconfig.json

# Files used for development only
.env
.eslintrc.js

# Node.js dependencies:
node_modules/
 ```

