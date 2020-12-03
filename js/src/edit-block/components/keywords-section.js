/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useBlock } from '../hooks';

/**
 * The keywords editing section.
 *
 * @return {React.ReactElement} The keywords section.
 */
const KeywordsSection = () => {
	const { block, changeBlock } = useBlock();
	const maxNumberOfKeywords = 3;

	/**
	 * Handles changing of the tokens.
	 *
	 * @param {Array} tokens The new tokens (keywords).
	 */
	const handleChange = ( tokens ) => {
		changeBlock( { keywords: tokens } );
	};

	return (
		<div className="mt-5">
			<FormTokenField
				// @ts-ignore
				label={ sprintf(
					/* translators: %1$d: the max number of keywords */
					__( 'Keywords (max %1$d)', 'genesis-custom-blocks' ),
					maxNumberOfKeywords
				) }
				value={ block.keywords }
				maxLength={ maxNumberOfKeywords }
				onChange={ handleChange }
				messages={ {
					added: __( 'Keyword added.', 'genesis-custom-blocks' ),
					removed: __( 'Keyword removed.', 'genesis-custom-blocks' ),
					remove: __( 'Remove keyword', 'genesis-custom-blocks' ),
				} }
			/>
		</div>
	);
};

export default KeywordsSection;
