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
import { storeConfig as blockEditorStoreConfig } from '@wordpress/block-editor';
import { storeConfig } from '@wordpress/editor';

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

			const [ subRegistry, setSubRegistry ] = useState( null );
			useEffect( () => {
				const newRegistry = createRegistry(
					{
						'core/block-editor': blockEditorStoreConfig,
					},
					registry
				);
				newRegistry.registerStore( 'core/editor', storeConfig );
				setSubRegistry( newRegistry );
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

console.log( `about to export ${ withRegistryProvider }` );
export default withRegistryProvider;
