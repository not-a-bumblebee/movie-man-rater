#!/usr/bin/env bash
set -e

PLAYWRIGHT_BROWSERS_PATH=/opt/render/project/playwright npx playwright install

echo PLAYWRIGHT_BROWSER_PATH

npx playwright install chromium




# Store/pull Playwright cache with build cache
if [[ ! -d $PLAYWRIGHT_BROWSERS_PATH ]]; then
 
  echo "...Copying Playwright Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/playwright/  
else 
  echo "...Storing Playwright Cache in Build Cache" 
  cp -R $PLAYWRIGHT_BROWSERS_PATH $XDG_CACHE_HOME
fi

