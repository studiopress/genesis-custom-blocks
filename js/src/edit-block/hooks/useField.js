/* global gcbEditor */

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getBlock,
	getBlockNameWithNameSpace,
	getNewFieldNumber,
	getOtherLocation,
	setCorrectOrderForFields,
} from '../helpers';
import { getFieldsAsArray, getFieldsAsObject } from '../../common/helpers';

/**
 * @typedef {Object} UseFieldReturn The return value of useField.
 * @property {Function} addNewField Adds a new field.
 * @property {Object} controls All of the possible controls.
 * @property {Function} deleteField Deletes this field.
 * @property {Function} duplicateField Deletes this field.
 * @property {Function} changeControl Changes the control of the field.
 * @property {Function} changeFieldSettings Changes field settings.
 * @property {Function} getField Gets the selected field.
 * @property {Function} getFieldsForLocation Gets all of the fields for a given location.
 * @property {Function} reorderFields Reorders the fields for a given location.
 */

/**
 * @typedef {Object} SelectedField A field to change.
 * @property {string} name The name of the field.
 * @property {string} [parent] The name of the field's parent, if any.
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
	const postId = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostId(),
		[]
	);
	const { editEntityRecord } = useDispatch( 'core' );
	const editPost = useCallback( ( newEdits ) => {
		editEntityRecord(
			'postType',
			'genesis_custom_block',
			postId,
			{
				...newEdits,
				blocks: null, // Prevents getEditedPostContent() from parsing [] blocks.
			}
		);
	}, [ editEntityRecord, postId ] );
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = useMemo(
		() => fullBlock[ blockNameWithNameSpace ] || {},
		[ fullBlock, blockNameWithNameSpace ]
	);

	/**
	 * Adds a new field to the end of the existing fields.
	 *
	 * @param {string} location The location to add the field to.
	 * @param {string|null} parentField The parent field to add it to, if any.
	 * @return {string} The name of the new field.
	 */
	const addNewField = useCallback( ( location, parentField ) => {
		const { fields = {} } = block;
		const newFieldNumber = getNewFieldNumber(
			null === parentField
				? fields
				: fields[ parentField ].sub_fields
		);
		const newFieldName = newFieldNumber
			? `new-field-${ newFieldNumber.toString() }`
			: 'new-field';
		const label = newFieldNumber
			? sprintf(
				// translators: %1$d: the field number
				__( 'New Field %1$d', 'genesis-custom-blocks' ),
				newFieldNumber
			)
			: __( 'New Field', 'genesis-custom-blocks' );

		const newField = {
			name: newFieldName,
			location,
			label,
			control: 'text',
			type: 'string',
			order: Object.values( fields ).length,
		};

		if ( null === parentField ) {
			fields[ newFieldName ] = newField;
		} else {
			newField.parent = parentField;
			fields[ parentField ].sub_fields[ newFieldName ] = newField;
		}

		block.fields = fields;
		fullBlock[ blockNameWithNameSpace ] = block;

		editPost( { content: JSON.stringify( fullBlock ) } );
		return newFieldName;
	}, [ block, blockNameWithNameSpace, editPost, fullBlock ] );

	const changeControl = useCallback(
		/**
		 * Changes the control of a field.
		 *
		 * @param {SelectedField} fieldToChange The field to change.
		 * @param {string} newControlName The name of the control to change to.
		 */
		( fieldToChange, newControlName ) => {
			const newControl = controls[ newControlName ];
			if ( ! newControl || ! fieldToChange.name ) {
				return;
			}

			const previousField = fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.name ];
			const newField = {
				name: previousField.name,
				label: previousField.label,
				location: previousField.location,
				order: previousField.order,
				control: newControl.name,
				type: newControl.type,
			};

			fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.name ] = newField;
			editPost( { content: JSON.stringify( fullBlock ) } );
		},
		[ blockNameWithNameSpace, controls, editPost, fullBlock ]
	);

	/**
	 * Changes a field name (slug), and returns the fields.
	 *
	 * Each field is accessed in fields with a key of its name.
	 * So renaming a field involves changing that key
	 * and the field's name property.
	 *
	 * @param {Object} fields The fields from which to rename a field.
	 * @param {string} previousName The previous field name (slug).
	 * @param {string} newName The new field name (slug).
	 * @return {Object} The fields with the field renamed.
	 */
	const changeFieldName = ( fields, previousName, newName ) => {
		fields[ newName ] = { ...fields[ previousName ], name: newName };
		delete fields[ previousName ];
		return fields;
	};

	/**
	 * Gets the fields for either the editor or inspector.
	 *
	 * @param {string} location The location, like 'editor', or 'inspector'.
	 * @param {string|null} parentField The parent field, if any.
	 * @return {Array|null} The fields with the given location.
	 */
	const getFieldsForLocation = useCallback( ( location, parentField = null ) => {
		if ( ! block || ! block.fields ) {
			return null;
		}

		const fields = null === parentField ? block.fields : block.fields[ parentField ].sub_fields;
		if ( ! fields ) {
			return null;
		}

		return getFieldsAsArray( fields ).filter( ( field ) => {
			if ( 'editor' === location ) {
				return ! field.location || 'editor' === field.location;
			}

			return location === field.location;
		} );
	}, [ block ] );

	/**
	 * Moves a field to another location, and sets the correct order properties.
	 *
	 * @param {number} moveFrom The index of the field to move.
	 * @param {number} moveTo The index that the field should be moved to.
	 * @param {string} currentLocation The current field's location, like 'editor'.
	 */
	const changeFieldLocation = useCallback( ( fields, fieldName, newLocation ) => {
		const fieldToMove = fields[ fieldName ];
		const previousLocation = fieldToMove.location;

		const previousLocationFields = getFieldsForLocation( previousLocation );
		const fieldsWithoutMovedField = previousLocationFields.filter( ( field ) => {
			return field.name !== fieldName;
		} );

		const newLocationFields = getFieldsForLocation( newLocation );
		newLocationFields.push( fieldToMove );

		return getFieldsAsObject( [
			...setCorrectOrderForFields( fieldsWithoutMovedField ),
			...setCorrectOrderForFields( newLocationFields ),
		] );
	}, [ getFieldsForLocation ] );

	const changeFieldSettings = useCallback(
		/**
		 * Changes a field setting.
		 *
		 * @param {SelectedField} fieldToChange The field to change.
		 * @param {Object} newSettings The new settings of the field.
		 */
		( fieldToChange, newSettings ) => {
			if ( newSettings.hasOwnProperty( 'location' ) ) {
				fullBlock[ blockNameWithNameSpace ].fields = changeFieldLocation(
					fullBlock[ blockNameWithNameSpace ].fields,
					fieldToChange.name,
					newSettings.location
				);
			}

			if ( newSettings.hasOwnProperty( 'name' ) ) {
				fullBlock[ blockNameWithNameSpace ].fields = changeFieldName(
					fullBlock[ blockNameWithNameSpace ].fields,
					fieldToChange.name,
					newSettings.name
				);
			}

			const name = newSettings.hasOwnProperty( 'name' ) ? newSettings.name : fieldToChange.name;
			const currentField = fieldToChange.parent
				? fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.parent ].sub_fields[ fieldToChange.name ]
				: fullBlock[ blockNameWithNameSpace ].fields[ name ];

			const newField = {
				...currentField,
				...newSettings,
			};

			if ( fieldToChange.parent ) {
				fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.parent ]
					.sub_fields[ fieldToChange.name ] = newField;
			} else {
				fullBlock[ blockNameWithNameSpace ].fields[ name ] = newField;
			}

			editPost( { content: JSON.stringify( fullBlock ) } );
		},
		[ blockNameWithNameSpace, changeFieldLocation, editPost, fullBlock ]
	);

	/**
	 * Deletes this field.
	 */
	const deleteField = useCallback( ( fieldName ) => {
		delete fullBlock[ blockNameWithNameSpace ].fields[ fieldName ];
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, editPost, fullBlock ] );

	const getField = useCallback(
		/**
		 * Gets a field, if it exists.
		 *
		 * @param {SelectedField} field The field to get.
		 * @return {Object} The field, or {}.
		 */
		( field ) => {
			if ( ! field || ! block.fields ) {
				return {};
			}

			return field.parent
				? block.fields[ field.parent ].sub_fields[ field.name ]
				: block.fields[ field.name ];
		},
		[ block ]
	);

	/**
	 * Duplicates this field.
	 *
	 * @param {string} fieldName The name of the field to duplicate.
	 */
	const duplicateField = useCallback( ( fieldName ) => {
		const currentField = getField( fieldName );
		const { fields = {} } = block;
		const newFieldNumber = getNewFieldNumber( fields, fieldName );
		const newFieldName = `${ fieldName }-${ newFieldNumber.toString() }`;

		fields[ newFieldName ] = {
			...currentField,
			name: newFieldName,
			order: Object.values( fields ).length,
		};

		block.fields = fields;
		fullBlock[ blockNameWithNameSpace ] = block;

		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, editPost, fullBlock, block, getField ] );

	/**
	 * Reorders fields, moving a single field to another position.
	 *
	 * @param {number} moveFrom The index of the field to move.
	 * @param {number} moveTo The index that the field should be moved to.
	 * @param {string} currentLocation The current field's location, like 'editor'.
	 */
	const reorderFields = useCallback( ( moveFrom, moveTo, currentLocation ) => {
		const fieldsToReorder = getFieldsForLocation( currentLocation );
		if ( ! fieldsToReorder.length ) {
			return;
		}

		const newFields = [ ...fieldsToReorder ];
		[ newFields[ moveFrom ], newFields[ moveTo ] ] = [ newFields[ moveTo ], newFields[ moveFrom ] ];

		fullBlock[ blockNameWithNameSpace ].fields = getFieldsAsObject( [
			...setCorrectOrderForFields( newFields ),
			...getFieldsForLocation( getOtherLocation( currentLocation ) ),
		] );
		editPost( { content: JSON.stringify( fullBlock ) } );
	}, [ blockNameWithNameSpace, editPost, fullBlock, getFieldsForLocation ] );

	return {
		addNewField,
		controls,
		changeControl,
		changeFieldSettings,
		deleteField,
		duplicateField,
		getField,
		getFieldsForLocation,
		reorderFields,
	};
};

export default useField;
