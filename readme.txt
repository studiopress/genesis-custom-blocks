=== Genesis Custom Blocks ===

Contributors: lukecarbis, ryankienstra, Stino11, rheinardkorf, studiopress, wpengine
Tags: gutenberg, blocks, block editor, fields, template
Requires at least: 5.7
Tested up to: 6.0
Requires PHP: 5.6
Stable tag: 1.5.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl

Custom blocks for WordPress made easy.

== Description ==

Genesis Custom Blocks provides WordPress developers with the tools they need to take control of the block-first reality of modern WordPress.

The WordPress block editor (AKA Gutenberg) opens up a whole new world for the way we build pages, posts, and websites with WordPress. Genesis Custom Blocks makes it easy to harness this and build custom blocks the way you want them to be built. Whether you want to implement a custom design, deliver unique functionality, or even remove your dependence on other plugins, Genesis Custom Blocks equips you with the tools you need to hit “Publish” sooner.

**Take control of design** - Implement beautiful, custom designs with fine-tuned front-end templating control.

**Build unique functionality** - Build blocks that function and behave exactly as you need.

**Extend & Integrate** - Easily extend your custom blocks to integrate with third-party apps and plugins.

== Features ==

= A Familiar Experience =
Work within the WordPress admin with an interface you already know.

= Block Fields =
Add from a growing list of available fields to your custom blocks.

= Simple Templating =
Let the plugin do the heavy lifting so you can use the built-in editor, or familiar WordPress development practices to build block templates.

= Developer Friendly Functions =
As an alternative to the built-in editor, there are simple functions, ready to render and work with the data stored through your custom block fields.

== Currently available block fields ==
* Inner Blocks Field
* File Field
* Text Field
* Image Field
* URL Field
* Toggle Field
* Textarea Field
* Select Field
* Range Field
* Radio Field
* Number Field
* Multi-select Field
* Email Field
* Color Field
* Checkbox Field

== Do more with Genesis Pro ==
For those wanting to level-up with Genesis Custom Blocks, a Genesis Pro subscription brings some serious power-user features:

= Genesis Custom Blocks Pro Features =
* Repeater Field
* Taxonomy Field
* Post Field
* User Field
* Rich Text Field
* Classic Text Field
* Block Level Import/Export
* 24/7 Support

Genesis Pro includes even more value for modern WordPress content creators, marketers, and developers. [Learn more about Genesis Pro here](https://www.studiopress.com/genesis-pro/).

== Developer docs you can rely on. ==
Developer tools are only as good as their docs. That's why we take them seriously. Here are a few links to get you started:

* [Getting Started](https://developer.wpengine.com/genesis-custom-blocks/get-started/)
* [FAQs](https://developer.wpengine.com/genesis-custom-blocks/faqs/)
* [Block Fields](https://developer.wpengine.com/genesis-custom-blocks/fields/)
* [PHP Functions](https://developer.wpengine.com/genesis-custom-blocks/functions/)

== Installation ==
This plugin can be installed directly from your site.
1. Log in and navigate to Plugins → Add New.
2. Type “Genesis Custom Blocks” into the Search and hit Enter.
3. Locate the Genesis Custom Blocks plugin in the list of search results and click Install Now.
4. Once installed, click the Activate link.

It can also be installed manually.
1. Download the Genesis Custom Blocks plugin from WordPress.org.
2. Unzip the package and move to your plugins directory.
3. Log into WordPress and navigate to the Plugins screen.
4. Locate Genesis Custom Blocks in the list and click the Activate link.

== Frequently Asked Questions ==
**Q: Do I need to work with the Genesis Framework or any of the other Genesis plugins/themes to use this plugin?**
A: No. You can use this plugin completely independently. All you need is to have the block editor enabled on your WordPress site.

**Q: Do I need to change to the new built-in Template Editor in /wp-admin?**
A: No. You can keep using your PHP block templates like block-example.php.

== Links ==
* [WordPress.org](https://wordpress.org/plugins/genesis-custom-blocks)
* [GitHub](https://github.com/studiopress/genesis-custom-blocks)
* [Documentation](https://developer.wpengine.com/genesis-custom-blocks)

== Changelog ==

= 1.5.1 - 2022-08-09 =
* PHP 8.1 compatibility fixes. [PR 119](https://github.com/studiopress/genesis-custom-blocks/pull/119)

= 1.5.0 - 2022-03-24 =

* Allow previewing InnerBlocks in the block editor. [PR 114](https://github.com/studiopress/genesis-custom-blocks/pull/114)
* Allow opting in to analytics. [PR 101](https://github.com/studiopress/genesis-custom-blocks/pull/101)
* Remove some of the Settings page logic, as it's moved to the free plugin. [PR 42](https://github.com/studiopress/genesis-custom-blocks-pro/pull/42)

= 1.4.0 - 2021-10-14 =

* Optional modal for editor fields. [PR 93](https://github.com/studiopress/genesis-custom-blocks/pull/93)

= 1.3.1 - 2021-08-26 =

Fix for fields with long strings

* Fix a regression that caused editor errors for fields with long strings. [PR 89](https://github.com/studiopress/genesis-custom-blocks/pull/89)
* Update e2e tests for WP 5.8. [PR 87](https://github.com/studiopress/genesis-custom-blocks/pull/87)

= 1.3.0 - 2021-07-20 =

InnerBlocks, File field, WP 5.8 compatibility

* Add InnerBlocks, allowing any block inside a GCB block. [PR 68](https://github.com/studiopress/genesis-custom-blocks/pull/68)
* Add a file field, like for .pdf or .zip files. [PR 74](https://github.com/studiopress/genesis-custom-blocks/pull/74)
* In WP 5.8, prevent a PHP notice by using the new filter 'block_categories_all'. [PR 85](https://github.com/studiopress/genesis-custom-blocks/pull/85) 

= 1.2.0 - 2021-06-28 =

New Template Editor, Editor Preview, and Front-end Preview

* Template Editor UI, though the PHP templates still work just like before. [PR 65](https://github.com/studiopress/genesis-custom-blocks/pull/65), [PR 69](https://github.com/studiopress/genesis-custom-blocks/pull/69), [PR 72](https://github.com/studiopress/genesis-custom-blocks/pull/72)
* Add Editor Preview and Front-end Preview. [PR 63](https://github.com/studiopress/genesis-custom-blocks/pull/63)
* Don't display the editor form if there's no editor field. [PR 64](https://github.com/studiopress/genesis-custom-blocks/pull/64)
* Fix an issue with the default value of 'Checkbox' and 'Toggle' fields. [PR 60](https://github.com/studiopress/genesis-custom-blocks/pull/60)
* Display the help text in the TextareaArray setting. [PR 62](https://github.com/studiopress/genesis-custom-blocks/pull/62)
* Improved abstraction by removing duplicated copy. [PR 78](https://github.com/studiopress/genesis-custom-blocks/pull/78)

= 1.1.0 - 2021-01-27 =

New, more effortless editor, with undo/redo and separate editor/inspector

* Template and onboarding notices, restore e2e test. [PR 55](https://github.com/studiopress/genesis-custom-blocks/pull/55)
* Add functionality to the duplicate button. [PR 53](https://github.com/studiopress/genesis-custom-blocks/pull/53)
* Auto-slug block and field names, make Repeater work. [PR 51](https://github.com/studiopress/genesis-custom-blocks/pull/51)
* Add fields to the correct location, allow creating new block. [PR 48](https://github.com/studiopress/genesis-custom-blocks/pull/48)
* Add editor field UI component. [PR 44](https://github.com/studiopress/genesis-custom-blocks/pull/44)
* Add the 'Block Settings' panel. [PR 43](https://github.com/studiopress/genesis-custom-blocks/pull/43)
* Edit Block UI: Render block field. [PR 41](https://github.com/studiopress/genesis-custom-blocks/pull/41)

= 1.0.3 - 2020-10-21 =

Allow more text and improve activation experience

* Allow fields with a huge amount of text. [PR 39](https://github.com/studiopress/genesis-custom-blocks/pull/39)
* Ensure that all submenus appear on first installation. [PR 40](https://github.com/studiopress/genesis-custom-blocks/pull/40)

= 1.0.2 - 2020-09-16 =

Fix a notice from the Textarea field

* Fixes a notice from the Textarea field having the wrong type. [PR 33](https://github.com/studiopress/genesis-custom-blocks/pull/33)

= 1.0.1 - 2020-09-01 =

Fix an error if Block Lab 1.5.6 is also active

* Fixes an error with Block Lab 1.5.6, where it defines functions twice
* Error does not occur with latest Block Lab

= 1.0.0 - 2020-09-01 =

Plugin released!

* Easily create custom blocks
* 13 fields to add
* Simple templating, with PHP files
