<?php
/**
 * Component abstract.
 *
 * @package   Genesis\CustomBlocks
 * @copyright Copyright(c) 2021, Genesis Custom Blocks
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Genesis\CustomBlocks;

/**
 * Class ComponentAbstract
 */
abstract class ComponentAbstract implements ComponentInterface {

	/**
	 * Point to the $plugin instance.
	 *
	 * @var PluginInterface
	 */
	protected $plugin;

	/**
	 * Set the plugin so that it can be referenced later.
	 *
	 * @param PluginInterface $plugin The plugin.
	 *
	 * @return ComponentInterface $this
	 */
	public function set_plugin( PluginInterface $plugin ) {
		$this->plugin = $plugin;
		return $this;
	}

	/**
	 * Handle deprecated component methods.
	 *
	 * @param string $name      The name of the method called in this class.
	 * @param array  $arguments The arguments passed to the method.
	 *
	 * @return mixed The result of calling the deprecated method, if it exists.
	 *
	 * @throws \Error Fallback to a standard PHP error.
	 */
	public function __call( $name, $arguments ) {
		$class         = get_class( $this );
		$class_name    = strtolower( str_replace( '\\', '__', $class ) );
		$function_name = "${class_name}__${name}";

		if ( function_exists( $function_name ) ) {
			return call_user_func_array( $function_name, $arguments );
		}

		// Intentionally untranslated, to match PHP's error message.
		throw new \Error( "Call to undefined method $class::$name()" );
	}

	/**
	 * Register any hooks that this component needs.
	 *
	 * @return void
	 */
	abstract public function register_hooks();
}
