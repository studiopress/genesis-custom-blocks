/* global gcbEditor */

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlock } from '../helpers';

/**
 * @typedef {Object} UseFieldReturn The return value of useField.
 * @property {Object} controls All of the possible controls.
 * @property {Function} deleteField Deletes this field.
 * @property {Function} changeControl Changes the control of the field.
 * @property {Function} changeFieldSetting Changes a field setting.
 * @property {Function} getField Gets the selected field.
 */

/**
 * Gets the field context.
 *
 * @return {UseFieldReturn} The field context and functions to change it.
 */
const useField = () => {
	// @ts-ignore
	const { controls } = gcbEditor;
	const editedPostContent = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostContent(),
		[]
	);

	const getFullBlock = useCallback(
		() => getBlock( editedPostContent ),
		[ editedPostContent ]
	);

	const fullBlock = getFullBlock();
	const { editPost } = useDispatch( 'core/editor' );
	const blockNameWithNamespace = Object.keys( fullBlock )[ 0 ];
	const block = fullBlock[ blockNameWithNamespace ];

	/**
	 * Changes the control of a field.
	 *
	 * @param {string} newControlName The name of the control to change to.
	 */
	const changeControl = useCallback( ( fieldName, newControlName ) => {
		const newControl = controls[ newControlName ];
		if ( ! newControl || ! fieldName ) {
			return;
		}

		if ( ! fullBlock[ blockNameWithNamespace ].fields ) {
			fullBlock[ blockNameWithNamespace ].fields = [];
		}

		// Todo: handle multiple fields when it's possible to add a field.
		const previousField = fullBlock[ blockNameWithNamespace ].fields[ fieldName ];
		const newField = {
			name: previousField.name,
			label: previousField.label,
			control: newControl.name,
			type: newControl.type,
		};

		fullBlock[ blockNameWithNamespace ].fields[ fieldName ] = newField;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, controls, editPost, fullBlock ] );

	/**
	 * Gets a field, if it exists.
	 *
	 * @param {string} fieldName The name of the field.
	 * @return {Object} The field, or {}.
	 */
	const getField = useCallback( ( fieldName ) => {
		return fieldName ? block.fields[ fieldName ] : {};
	}, [ block ] );

	/**
	 * Changes a field setting.
	 *
	 * @param {string} settingKey The key of the setting, like 'label' or 'placeholder'.
	 * @param {any} newSettingValue The new setting value.
	 */
	const changeFieldSetting = useCallback( ( fieldName, settingKey, newSettingValue ) => {
		fullBlock[ blockNameWithNamespace ].fields[ fieldName ][ settingKey ] = newSettingValue;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, editPost, fullBlock ] );

	/**
	 * Deletes this field.
	 */
	const deleteField = useCallback( ( fieldName ) => {
		delete fullBlock[ blockNameWithNamespace ].fields[ fieldName ];
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNamespace, editPost, fullBlock ] );

	return {
		controls,
		deleteField,
		getField,
		changeControl,
		changeFieldSetting,
	};
};

export default useField;