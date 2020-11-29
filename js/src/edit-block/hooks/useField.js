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
 * @property {Function} changeFieldName Changes the field name.
 * @property {Function} changeFieldSettings Changes field settings.
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
	const blockNameWithNameSpace = Object.keys( fullBlock )[ 0 ];
	const block = fullBlock[ blockNameWithNameSpace ];

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

		if ( ! fullBlock[ blockNameWithNameSpace ].fields ) {
			fullBlock[ blockNameWithNameSpace ].fields = [];
		}

		const previousField = fullBlock[ blockNameWithNameSpace ].fields[ fieldName ];
		const newField = {
			name: previousField.name,
			label: previousField.label,
			control: newControl.name,
			type: newControl.type,
		};

		fullBlock[ blockNameWithNameSpace ].fields[ fieldName ] = newField;
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, controls, editPost, fullBlock ] );

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
	const changeFieldSettings = useCallback( ( fieldName, newSettings ) => {
		const field = fullBlock[ blockNameWithNameSpace ].fields[ fieldName ];
		fullBlock[ blockNameWithNameSpace ].fields[ fieldName ] = {
			...field,
			...newSettings,
		};

		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, editPost, fullBlock ] );

	/**
	 * Changes a field name (slug).
	 *
	 * @param {string} previousName The previous field name (slug).
	 * @param {string} newName The new field name (slug).
	 * @param {Object} defaultValues The new field values, if any.
	 */
	const changeFieldName = useCallback( ( previousName, newName, newValues = {} ) => {
		fullBlock[ blockNameWithNameSpace ].fields[ newName ] = fullBlock[ blockNameWithNameSpace ].fields[ previousName ];
		delete fullBlock[ blockNameWithNameSpace ].fields[ previousName ];

		fullBlock[ blockNameWithNameSpace ].fields[ newName ] = {
			...fullBlock[ blockNameWithNameSpace ].fields[ newName ],
			...newValues,
		};

		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ editPost, blockNameWithNameSpace, fullBlock ] );

	/**
	 * Deletes this field.
	 */
	const deleteField = useCallback( ( fieldName ) => {
		delete fullBlock[ blockNameWithNameSpace ].fields[ fieldName ];
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, editPost, fullBlock ] );

	return {
		controls,
		deleteField,
		getField,
		changeControl,
		changeFieldName,
		changeFieldSettings,
	};
};

export default useField;
