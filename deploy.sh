#!/bin/bash

set -euo pipefail
npm install
npm run build --project 'ngx-cable-x'
npx semantic-release
