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
 * @see https://github.com/WordPress/gutenberg/blob/8d5fd89f573e00601b189b1a2f87d5bc7b862349/packages/editor/src/components/provider/with-registry-provider.js
 */
const withRegistryProvider = createHigherOrderComponent(
	( WrappedComponent ) =>
		withRegistry( ( props ) => {
			const {
				useSubRegistry = true,
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
