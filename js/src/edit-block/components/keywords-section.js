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

	return (
		<div className="mt-5">
			<FormTokenField
				// @ts-ignore
				label={ __( 'Keywords', 'genesis-custom-blocks' ) }
				value={ block.keywords }
				maxLength={ maxNumberOfKeyword }
				onChange={ ( tokens ) => {
					changeBlock( { keywords: tokens } );
				} }
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
