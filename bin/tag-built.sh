#!/bin/bash
# Mainly copied from the Official AMP Plugin for WordPress

set -e

npm run gulp
tag=update/analytics-and-copyright
if [[ -z "$tag" ]]; then
	echo "Error: Unable to determine tag."
	exit 1
fi

built_tag="1.5.0-built"

git checkout "$tag"
mkdir built
git clone . built/
cd built
git checkout "$tag"
git rm -r $(git ls-files)
rsync -avz ../package/trunk/ ./
git add -A .
git commit -m "Build $tag" --no-verify
git tag "$built_tag"
git push origin "$built_tag"
cd ..
git push origin "$built_tag"
rm -rf built

echo "Pushed tag $built_tag."
echo "See https://github.com/studiopress/genesis-custom-blocks/releases/tag/$built_tag"
echo "For https://github.com/studiopress/genesis-custom-blocks/releases/tag/$tag"
