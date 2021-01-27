/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { PostTrash } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	CategorySection,
	IconSection,
	KeywordsSection,
	PostTypesSection,
	SlugSection,
} from './';

/**
 * The block editing panel.
 *
 * @return {React.ReactElement} The field panel component.
 */
const BlockPanel = () => (
	<div className="p-4">
		<h4 className="text-sm font-semibold">
			{ __( 'Block Settings', 'genesis-custom-blocks' ) }
		</h4>
		<SlugSection />
		<IconSection />
		<CategorySection />
		<KeywordsSection />
		<PostTypesSection />
		<div className="mt-4">
			<PostTrash />
		</div>
	</div>
);

export default BlockPanel;
