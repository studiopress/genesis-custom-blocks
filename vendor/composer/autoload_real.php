<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit206fafaac84f5976dfff3f2b4e809827
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInit206fafaac84f5976dfff3f2b4e809827', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit206fafaac84f5976dfff3f2b4e809827', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit206fafaac84f5976dfff3f2b4e809827::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
