## Changelog ##

### 1.5.0 - 2022-03-24 ###

* Allow previewing InnerBlocks in the block editor. [PR 114](https://github.com/studiopress/genesis-custom-blocks/pull/114)
* Allow opting in to analytics. [PR 101](https://github.com/studiopress/genesis-custom-blocks/pull/101)
* Remove some of the Settings page logic, as it's moved to the free plugin. [PR 42](https://github.com/studiopress/genesis-custom-blocks-pro/pull/42)

### 1.4.0 - 2021-10-14 ###

* Optional modal for editor fields. [PR 93](https://github.com/studiopress/genesis-custom-blocks/pull/93)

### 1.3.1 - 2021-08-26 ###

Fix for fields with long strings

* Fix a regression that caused editor errors for fields with long strings. [PR 89](https://github.com/studiopress/genesis-custom-blocks/pull/89)
* Update e2e tests for WP 5.8. [PR 87](https://github.com/studiopress/genesis-custom-blocks/pull/87)

### 1.3.0 - 2021-07-20 ###

InnerBlocks, File field, WP 5.8 compatibility

* Add InnerBlocks, allowing any block inside a GCB block. [PR 68](https://github.com/studiopress/genesis-custom-blocks/pull/68)
* Add a file field, like for .pdf or .zip files. [PR 74](https://github.com/studiopress/genesis-custom-blocks/pull/74)
* In WP 5.8, prevent a PHP notice by using the new filter 'block_categories_all'. [PR 85](https://github.com/studiopress/genesis-custom-blocks/pull/85) 

### 1.2.0 - 2021-06-28 ###

New Template Editor, Editor Preview, and Front-end Preview

* Template Editor UI, though the PHP templates still work just like before. [PR 65](https://github.com/studiopress/genesis-custom-blocks/pull/65), [PR 69](https://github.com/studiopress/genesis-custom-blocks/pull/69), [PR 72](https://github.com/studiopress/genesis-custom-blocks/pull/72)
* Add Editor Preview and Front-end Preview. [PR 63](https://github.com/studiopress/genesis-custom-blocks/pull/63)
* Don't display the editor form if there's no editor field. [PR 64](https://github.com/studiopress/genesis-custom-blocks/pull/64)
* Fix an issue with the default value of 'Checkbox' and 'Toggle' fields. [PR 60](https://github.com/studiopress/genesis-custom-blocks/pull/60)
* Display the help text in the TextareaArray setting. [PR 62](https://github.com/studiopress/genesis-custom-blocks/pull/62)
* Improved abstraction by removing duplicated copy. [PR 78](https://github.com/studiopress/genesis-custom-blocks/pull/78)

### 1.1.0 - 2021-01-27 ###

New, more effortless editor, with undo/redo and separate editor/inspector

* Template and onboarding notices, restore e2e test. [PR 55](https://github.com/studiopress/genesis-custom-blocks/pull/55)
* Add functionality to the duplicate button. [PR 53](https://github.com/studiopress/genesis-custom-blocks/pull/53)
* Auto-slug block and field names, make Repeater work. [PR 51](https://github.com/studiopress/genesis-custom-blocks/pull/51)
* Add fields to the correct location, allow creating new block. [PR 48](https://github.com/studiopress/genesis-custom-blocks/pull/48)
* Add editor field UI component. [PR 44](https://github.com/studiopress/genesis-custom-blocks/pull/44)
* Add the 'Block Settings' panel. [PR 43](https://github.com/studiopress/genesis-custom-blocks/pull/43)
* Edit Block UI: Render block field. [PR 41](https://github.com/studiopress/genesis-custom-blocks/pull/41)

### 1.0.3 - 2020-10-21 ###

Allow more text and improve activation experience

* Allow fields with a huge amount of text. [PR 39](https://github.com/studiopress/genesis-custom-blocks/pull/39)
* Ensure that all submenus appear on first installation. [PR 40](https://github.com/studiopress/genesis-custom-blocks/pull/40)

### 1.0.2 - 2020-09-16 ###

Fix a notice from the Textarea field

* Fixes a notice from the Textarea field having the wrong type. [PR 33](https://github.com/studiopress/genesis-custom-blocks/pull/33)

### 1.0.1 - 2020-09-01 ###

Fix an error if Block Lab 1.5.6 is also active

* Fixes an error with Block Lab 1.5.6, where it defines functions twice
* Error does not occur with latest Block Lab

### 1.0.0 - 2020-09-01 ###

Plugin released!

* Easily create custom blocks
* 13 fields to add
* Simple templating, with PHP files
