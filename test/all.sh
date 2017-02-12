#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e

node ${DIR}/child-groups.js
node ${DIR}/file.js
node ${DIR}/middleware.js
node ${DIR}/simple.js