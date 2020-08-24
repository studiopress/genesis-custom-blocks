#!/bin/bash
# Mainly copied from the Official AMP Plugin for WordPress

set -e

gulp
tag=$(grep 'Version:' package/trunk/genesis-custom-blocks.php | sed 's/.*: //' | sed 's/-[0-9]\{8\}T[0-9]\{6\}Z-[a-f0-9]*$//')
if [[ -z "$tag" ]]; then
    echo "Error: Unable to determine tag."
    exit 1
fi

built_tag="$tag-built"
if git rev-parse "$built_tag" >/dev/null 2>&1; then
    echo "Error: Built tag already exists: $built_tag"
    exit 2
fi

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
