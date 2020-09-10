# Contributing to Genesis Custom Blocks

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

### Local Setup

Genesis Custom Blocks generally follows WordPress coding standards for PHP and JavaScript.

There's a pre-commit hook and linting scripts like `npm run lint`.

**Install Dependencies**

```
composer install && npm install
```

**Watch Changes**

```
npm run dev
```

**PHPUnit**

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit composer test
```

If you've already installed the DB for the [WordPress Core unit tests](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit), simply pass the path to [wordpress-develop/tests/phpunit/](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit) as `WP_TESTS_DIR`, as shown above.

Otherwise, clone [wordpress-develop](https://github.com/WordPress/wordpress-develop). Then, `cd` back to this plugin and do:

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit ./bin/install-wp-tests.sh <db name> <db user> <db password>
```

Use whatever DB name you'd like, and substitute a DB user and password that works in your environment.

### Branching

Generally, you'll want to branch off the default branch, `develop`.

If you're developing for a release branch, like `1.1`, branch off that.

Release branches themselves should be branched off `develop`.

### Plugin Versions

The plugin versions should follow [Semantic Versioning](https://semver.org/#semantic-versioning-200).

### Release Procedure

1. `checkout` locally whatever branch you want to release. It could be `develop`, or a release branch like `1.0`. 
1. Do `npm run gulp`, and you'll see `package/genesis-custom-blocks.x.x.x.zip`.
1. Smoke test that `.zip` file.
1. [Create a release](https://github.com/studiopress/genesis-custom-blocks/releases/new), targeting whatever branch you chose in step 1.
1. Upload the `.zip` file you created to the release page.
1. The 'Tag version' should be the plugin version, like `1.0.0`.
1. Publish the release
1. [CircleCI](https://github.com/studiopress/genesis-custom-blocks/blob/develop/.circleci/config.yml) will then deploy the plugin to the wp.org SVN
1. Smoke test the plugin [deployed to wp.org](https://wordpress.org/plugins/genesis-custom-blocks/)
1. If this release was for a release branch, like `1.0`, open a PR from that branch to `develop`.
1. Do `./bin/tag-built.sh`
1. This will create a built tag like `1.0.0-built` and push it. Then, other plugins like the Pro plugin can require this plugin as a Composer dependency.
1. In the Pro plugin's `composer.json`, [update](https://github.com/studiopress/genesis-custom-blocks-pro/blob/develop/CONTRIBUTING.md#plugin-dependency) the commit hash of this free plugin to the new built tag.
1. Also [create a release](https://github.com/studiopress/genesis-custom-blocks-pro/blob/develop/CONTRIBUTING.md#release-procedure) of the Pro plugin, as it should have the latest version of this free plugin.
1. To resume normal local development, do `composer install`, as running `gulp` will remove the Composer dev dependencies.

Thanks! :heart: :heart: :heart:

Genesis Custom Blocks Team
