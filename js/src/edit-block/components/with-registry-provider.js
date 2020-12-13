/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import {
	withRegistry,
	createRegistry,
	RegistryProvider,
} from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import { storeConfig } from '@wordpress/editor';

/**
 * Forked from Gutenberg, as it's not exported from @wordpress/editor.
 *
 * Also, this doesn't call createRegistry() for 'core/block-editor',
 * as this isn't a block editor, it's for a JSON blob of the block configuration.
 *
 * @see https://github.com/WordPress/gutenberg/blob/8d5fd89f573e00601b189b1a2f87d5bc7b862349/packages/editor/src/components/provider/with-registry-provider.js
 */
const withRegistryProvider = createHigherOrderComponent(
	( WrappedComponent ) =>
		withRegistry( ( props ) => {
			const {
				// @ts-ignore
				useSubRegistry = true,
				// @ts-ignore
				registry,
				...additionalProps
			} = props;
			if ( ! useSubRegistry ) {
				return <WrappedComponent { ...additionalProps } />;
			}

			const [ subRegistry ] = useState( null );
			useEffect( () => {
				createRegistry(
					{ 'core/editor': storeConfig },
					registry
				);
			}, [ registry ] );

			if ( ! subRegistry ) {
				return null;
			}

			return (
				<RegistryProvider value={ subRegistry }>
					<WrappedComponent { ...additionalProps } />
				</RegistryProvider>
			);
		} ),
	'withRegistryProvider'
);

export default withRegistryProvider;
