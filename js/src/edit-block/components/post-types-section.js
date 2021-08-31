/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useBlock, usePostTypes } from '../hooks';

/**
 * The category editor section.
 *
 * @return {React.ReactElement} The section to edit the block category.
 */
const PostTypesSection = () => {
	const { postTypes } = usePostTypes();
	const { block: { excluded = [] }, changeBlock } = useBlock();

	/**
	 * Gets whether the post type is enabled.
	 *
	 * @param {string} type The slug of the post type to check.
	 * @return {boolean} Whether the post type is enabeld.
	 */
	const isEnabled = ( type ) => {
		if ( ! Array.isArray( excluded ) ) {
			return true;
		}

		return ! excluded.includes( type );
	};

	/**
	 * Handles changing whether a post type is enabled.
	 *
	 * @param {React.ChangeEvent} event The event on changing the post type.
	 * @param {string} postType The post type to change.
	 */
	const handleChangePostTypes = ( event, postType ) => {
		if ( ! event.target ) {
			return;
		}

		// @ts-ignore
		const isExcluded = ! event.target.checked;
		const newExcluded = excluded && excluded.length ? [ ...excluded ] : [];

		if ( isExcluded && ! newExcluded.includes( postType ) ) {
			newExcluded.push( postType );
		}

		if ( ! isExcluded && newExcluded.includes( postType ) ) {
			newExcluded.splice( newExcluded.indexOf( postType ), 1 );
		}

		changeBlock( { excluded: newExcluded } );
	};

	return (
		<div className="mt-5">
			<span className="text-sm">{ __( 'Post Types', 'genesis-custom-blocks' ) }</span>
			{
				Array.isArray( postTypes ) && postTypes.length
					? postTypes.map( ( postType ) => {
						const id = `post-type-${ postType.slug }`;

						return (
							<div className="mt-2" key={ `post-type-enabled-${ postType.slug }` }>
								<input
									type="checkbox"
									id={ id }
									className="mr-2"
									value="1"
									checked={ isEnabled( postType.slug ) }
									onChange={ ( event ) => {
										handleChangePostTypes( event, postType.slug );
									} }
								/>
								<label className="text-sm" htmlFor={ id }>
									{ postType.label }
								</label>
							</div>
						);
					} )
					: null
			}
		</div>
	);
};

export default PostTypesSection;
