/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
	const maxNumberOfKeyword = 3;

	/**
	 * Handles changing of the tokens.
	 *
	 * @param {Array} tokens The new tokens (keywords).
	 */
	const handleChange = ( tokens ) => {
		changeBlock( 'keywords', tokens );
	};

	return (
		<div className="mt-5">
			<FormTokenField
				label={ __( 'Keywords', 'genesis-custom-blocks' ) }
				value={ block.keywords }
				maxLength={ maxNumberOfKeyword }
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
