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
import { DEFAULT_LOCATION } from '../constants';

/**
 * @typedef {Object} UseFieldReturn The return value of useField.
 * @property {function(string,string|null):string} addNewField Adds a new field.
 * @property {Object} controls All of the controls available.
 * @property {function(SelectedField):void} deleteField Deletes this field.
 * @property {function(SelectedField):void} duplicateField Duplicates this field.
 * @property {function(SelectedField,string):void} changeControl Changes the control of the field.
 * @property {function(SelectedField,Object):void} changeFieldSettings Changes field settings.
 * @property {function(SelectedField):Object} getField Gets the selected field.
 * @property {function(string,string|null):import('../components/editor').Field[]|null} getFieldsForLocation Gets all of the fields for a given location.
 * @property {function(number,number,string,string|null):void} reorderFields Reorders the fields for a given location.
 */

/** @typedef {import('../components/editor').SelectedField|import('../constants').NoFieldSelected} SelectedField The current field */

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
	const blockNameWithNameSpace = getBlockNameWithNameSpace( fullBlock );
	const block = useMemo(
		() => fullBlock[ blockNameWithNameSpace ] || {},
		[ fullBlock, blockNameWithNameSpace ]
	);

	const addNewField = useCallback(
		/**
		 * Adds a new field to the end of the existing fields.
		 *
		 * @param {string} location The location to add the field to.
		 * @param {string|null} parentField The parent field to add it to, if any.
		 * @return {string} The name of the new field.
		 */
		( location, parentField ) => {
			const { fields = {} } = block;
			const hasParent = null !== parentField;
			if ( hasParent && fields[ parentField ] && ! fields[ parentField ].sub_fields ) {
				fields[ parentField ].sub_fields = {};
			}

			const currentFields = hasParent
				? fields[ parentField ].sub_fields
				: fields;
			const newFieldNumber = getNewFieldNumber( currentFields );
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
				order: Object.values( currentFields ).length,
			};

			if ( hasParent ) {
				newField.parent = parentField;
				fields[ parentField ].sub_fields[ newFieldName ] = newField;
			} else {
				fields[ newFieldName ] = newField;
			}

			block.fields = fields;
			fullBlock[ blockNameWithNameSpace ] = block;

			editPost( { content: JSON.stringify( fullBlock ) } );
			return newFieldName;
		},
		[ block, blockNameWithNameSpace, editPost, fullBlock ]
	);

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

			const hasParent = fieldToChange.hasOwnProperty( 'parent' );
			const previousField = hasParent
				? fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.parent ].sub_fields[ fieldToChange.name ]
				: fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.name ];
			const newField = {
				name: previousField.name,
				label: previousField.label,
				location: previousField.location,
				order: previousField.order,
				control: newControl.name,
				type: newControl.type,
			};

			if ( 'repeater' === newControl.name ) {
				newField.sub_fields = {};
			}

			if ( hasParent ) {
				fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.parent ].sub_fields[ fieldToChange.name ] = newField;
			} else {
				fullBlock[ blockNameWithNameSpace ].fields[ fieldToChange.name ] = newField;
			}

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
		// If this is a repeater, rename the parent of its sub_fields.
		if ( fields[ previousName ] && fields[ previousName ].hasOwnProperty( 'sub_fields' ) ) {
			fields[ previousName ].sub_fields = getFieldsAsObject(
				Object.values( fields[ previousName ].sub_fields ).map( ( subField ) => {
					return {
						...subField,
						parent: newName,
					};
				} )
			);
		}

		fields[ newName ] = { ...fields[ previousName ], name: newName };
		delete fields[ previousName ];
		return fields;
	};

	const getFieldsForLocation = useCallback(
		/**
		 * Gets the fields for either the editor or inspector.
		 *
		 * @param {string} location The location, like 'editor', or 'inspector'.
		 * @param {string|null} parentField The parent field, if any.
		 * @return {import('../components/editor').Field[]|null} The fields with the given location.
		 */
		( location, parentField = null ) => {
			if ( ! block || ! block.fields ) {
				return null;
			}

			const fields = null === parentField ? block.fields : block.fields[ parentField ].sub_fields;
			if ( ! fields ) {
				return null;
			}

			return getFieldsAsArray( fields ).filter( ( field ) => {
				return location === field.location ||
					( ! field.location && DEFAULT_LOCATION === location );
			} );
		},
		[ block ]
	);

	const changeFieldLocation = useCallback(
		/**
		 * Moves a field to another location, and sets the correct order properties.
		 *
		 * @param {import('../components/editor').Field[]} fields The index of the field to move.
		 * @param {SelectedField} selectedField The field should be moved.
		 * @param {string} newLocation The location to move it to, like 'editor'.
		 */
		( fields, selectedField, newLocation ) => {
			const fieldToMove = fields[ selectedField.name ];
			const previousLocation = fieldToMove.location;

			const previousLocationFields = getFieldsForLocation( previousLocation );
			const fieldsWithoutMovedField = previousLocationFields.filter( ( field ) => {
				return field.name !== selectedField.name;
			} );

			const newLocationFields = getFieldsForLocation( newLocation );
			newLocationFields.push( fieldToMove );

			return getFieldsAsObject( [
				...setCorrectOrderForFields( fieldsWithoutMovedField ),
				...setCorrectOrderForFields( newLocationFields ),
			] );
		},
		[ getFieldsForLocation ]
	);

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
					fieldToChange,
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
			const currentField = fieldToChange.hasOwnProperty( 'parent' )
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

	const deleteField = useCallback(
		/**
		 * Deletes the field.
		 *
		 * @param {SelectedField} selectedField The field to delete.
		 */
		( selectedField ) => {
			if (
				selectedField.hasOwnProperty( 'parent' ) &&
				fullBlock[ blockNameWithNameSpace ].fields[ selectedField.parent ] &&
				fullBlock[ blockNameWithNameSpace ].fields[ selectedField.parent ].sub_fields
			) {
				delete fullBlock[ blockNameWithNameSpace ].fields[ selectedField.parent ].sub_fields[ selectedField.name ];
			} else {
				delete fullBlock[ blockNameWithNameSpace ].fields[ selectedField.name ];
			}

			editPost( { content: JSON.stringify( fullBlock ) } );
		},
		[ blockNameWithNameSpace, editPost, fullBlock ]
	);

	const getField = useCallback(
		/**
		 * Gets a field, if it exists.
		 *
		 * @param {SelectedField} field The field to get.
		 * @return {import('../components/editor').Field|{}} The field, or {}.
		 */
		( field ) => {
			if ( ! field || ! block.fields ) {
				return {};
			}

			const currentField = field.parent
				? block.fields[ field.parent ].sub_fields[ field.name ]
				: block.fields[ field.name ];

			return currentField || {};
		},
		[ block ]
	);

	const duplicateField = useCallback(
		/**
		 * Duplicates this field.
		 *
		 * @param {SelectedField} selectedField The name of the field to duplicate.
		 */
		( selectedField ) => {
			const { fields = {} } = block;
			const currentField = getField( selectedField );
			const hasParent = selectedField.hasOwnProperty( 'parent' );
			const currentFields = hasParent
				? fields[ selectedField.parent ].sub_fields
				: fields;

			const newFieldNumber = getNewFieldNumber( currentFields, selectedField.name );
			const newFieldName = `${ selectedField.name }-${ newFieldNumber.toString() }`;

			currentFields[ newFieldName ] = {
				...currentField,
				name: newFieldName,
				order: Object.values( fields ).length,
			};

			if ( hasParent ) {
				block.fields[ selectedField.parent ].sub_fields = currentFields;
			} else {
				block.fields = currentFields;
			}
			fullBlock[ blockNameWithNameSpace ] = block;

			editPost( { content: JSON.stringify( fullBlock ) } );
		},
		[ blockNameWithNameSpace, editPost, fullBlock, block, getField ]
	);

	const reorderFields = useCallback(
		/**
		 * Reorders fields, moving a single field to another position.
		 *
		 * @param {number} moveFrom The index of the field to move.
		 * @param {number} moveTo The index that the field should be moved to.
		 * @param {string} currentLocation The current field's location, like 'editor'.
		 * @param {string|null} parentField The field's parent field, if any.
		 */
		( moveFrom, moveTo, currentLocation, parentField = null ) => {
			const fieldsToReorder = getFieldsForLocation( currentLocation, parentField );
			if ( ! fieldsToReorder.length ) {
				return;
			}

			const newFields = [ ...fieldsToReorder ];
			[ newFields[ moveFrom ], newFields[ moveTo ] ] = [ newFields[ moveTo ], newFields[ moveFrom ] ];

			if ( null !== parentField ) {
				fullBlock[ blockNameWithNameSpace ].fields[ parentField ].sub_fields = getFieldsAsObject( [
					...setCorrectOrderForFields( newFields ),
				] );
			} else {
				fullBlock[ blockNameWithNameSpace ].fields = getFieldsAsObject( [
					...setCorrectOrderForFields( newFields ),
					...getFieldsForLocation( getOtherLocation( currentLocation ) ),
				] );
			}

			editPost( { content: JSON.stringify( fullBlock ) } );
		},
		[ blockNameWithNameSpace, editPost, fullBlock, getFieldsForLocation ]
	);

	return {
		addNewField,
		changeControl,
		changeFieldSettings,
		controls,
		deleteField,
		duplicateField,
		getField,
		getFieldsForLocation,
		reorderFields,
	};
};

export default useField;
