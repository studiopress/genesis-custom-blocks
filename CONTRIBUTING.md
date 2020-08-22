# Contributing to Genesis Custom Blocks

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

### Local Setup

Genesis Custom Blocks requires Node.js and generally follows the WordPress coding standards for PHP and JavaScript.

#### Node

**Install Dependencies**

```
composer install && npm install
```

**Watch Changes**

```
npm run dev
```

#### PHPUnit

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit composer test
```

If you've already installed the DB for the [WordPress Core unit tests](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit), simply pass the path to [wordpress-develop/tests/phpunit/](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit) as `WP_TESTS_DIR`, as shown above.

Otherwise, clone [wordpress-develop](https://github.com/WordPress/wordpress-develop).

Then, `cd` back to this plugin and do:

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit ./bin/install-wp-tests.sh <db name> <db user> <db password>
```

Use whatever DB name you'd like, and substitute a DB user and password that works in your environment.

### Release Procedure

1. [Create a release](https://github.com/studiopress/genesis-custom-blocks/releases/new), targeting either `develop` or the release branch, like `1.0.0`.
2. The 'Tag version' should be the version preceded with `v`, like `v1.0.0`.
3. Attach a `.zip` file of the built plugin.
4. `checkout` locally whatever branch you chose from step 1.
5. Do `./bin/tag-built.sh`
6. This will create a built version of the plugin and tag it. Then, other plugins or entire sites can require the plugin as a Composer dependency.

Thanks! :heart: :heart: :heart:

Genesis Custom Blocks Team
