#!/usr/bin/env bash
set -e

export PLAYWRIGHT_BROWSERS_PATH="/opt/render/project/ms-playwright"

npx playwright install chromium
# npm run build

echo "xdg_cache" $XDG_CACHE_HOME
echo "Playwright path:" $PLAYWRIGHT_BROWSERS_PATH

# Store/pull Playwright cache with build cache
if [[ ! -d $PLAYWRIGHT_BROWSERS_PATH ]]; then
  echo "...Copying Playwright Cache from Build Cache"
  cp -R $XDG_CACHE_HOME/ms-playwright/ $PLAYWRIGHT_BROWSERS_PATH
else
  echo "...Storing Playwright Cache in Build Cache"
  cp -R $PLAYWRIGHT_BROWSERS_PATH $XDG_CACHE_HOME
fi
