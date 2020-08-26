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

#### PHPUnit

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit composer test
```

If you've already installed the DB for the [WordPress Core unit tests](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit), simply pass the path to [wordpress-develop/tests/phpunit/](https://github.com/WordPress/wordpress-develop/tree/0228dd6a5d17aa42735fdff9b106afccb960311e/tests/phpunit) as `WP_TESTS_DIR`, as shown above.

Otherwise, clone [wordpress-develop](https://github.com/WordPress/wordpress-develop). Then, `cd` back to this plugin and do:

```
WP_TESTS_DIR=/path/to/wordpress-develop/tests/phpunit ./bin/install-wp-tests.sh <db name> <db user> <db password>
```

Use whatever DB name you'd like, and substitute a DB user and password that works in your environment.

### Release Procedure

1. `checkout` locally whatever branch you want to release. It could be `develop`, or a release branch like `1.0`. 
1. Do `npm run gulp`, and you'll see a `genesis-custom-blocks.zip` file in the `package/` directory.
1. Smoke test that `.zip` file.
1. [Create a release](https://github.com/studiopress/genesis-custom-blocks/releases/new), targeting whatever branch you chose in step 1.
1. Upload the `.zip` file you created to the release page.
1. The 'Tag version' should be the plugin version preceded with `v`, like `v1.0.0`.
1. There will be a `package/trunk/` directory from running `gulp` earlier. Use this to commit the new plugin version to the wp.org SVN repo.
1. Do `./bin/tag-built.sh`
1. This will create a built tag of the plugin and push it. Then, other plugins or entire sites can require the plugin as a Composer dependency.
1. To resume normal local development, do `composer install`, as running `gulp` will remove the Composer dev dependencies.

Thanks! :heart: :heart: :heart:

Genesis Custom Blocks Team
