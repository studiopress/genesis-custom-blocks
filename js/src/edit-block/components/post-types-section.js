/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
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
	const isEnabled = useCallback( ( type ) => {
		if ( ! Array.isArray( excluded ) ) {
			return true;
		}

		return ! excluded.includes( type );
	}, [ excluded ] );

	/**
	 * Handles changing whether a post type is enabled.
	 *
	 * @param {{ target: { value: React.SetStateAction<string>; }; }} event The event on changing the post type.
	 * @param {string} postType The post type to change.
	 */
	const handleChangePostTypes = useCallback( ( event, postType ) => {
		if ( ! event.target ) {
			return;
		}

		const isExcluded = ! event.target.checked;
		const newExcluded = excluded && excluded.length ? [ ...excluded ] : [];

		if ( isExcluded && ! newExcluded.includes( postType ) ) {
			newExcluded.push( postType );
		}

		if ( ! isExcluded && newExcluded.includes( postType ) ) {
			newExcluded.pop( newExcluded.indexOf( postType ) );
		}

		changeBlock( { excluded: newExcluded } );
	}, [ changeBlock, excluded ] );

	return (
		<div className="mt-5">
			<span className="text-sm" htmlFor="block-categories">{ __( 'Post Types', 'genesis-custom-blocks' ) }</span>
			{
				Array.isArray( postTypes ) && postTypes.length
					? postTypes.map( ( postType ) => {
						const id = `post-type-${ postType.slug }`;
						const key = `post-type-enabled-${ postType.slug }`;
						const checked = isEnabled( postType.slug );

						return (
							<div className="mt-2" key={ key }>
								<input
									type="checkbox"
									id={ id }
									className="mr-2"
									value="1"
									checked={ checked }
									onChange={ ( event ) => {
										handleChangePostTypes( event, postType.slug );
									} }
								/>
								<label className="text-sm" forHtml={ id }>
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
