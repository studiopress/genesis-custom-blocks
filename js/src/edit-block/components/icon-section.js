/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlock } from '../hooks';
import { getIconComponent, pascalCaseToSnakeCase } from '../../common/helpers';
import * as blockIcons from '../../common/icons';

/**
 * The icon editor section.
 *
 * @return {React.ReactElement} The icon editor.
 */
const IconSection = () => {
	const { block, changeBlock } = useBlock();
	const [ showIcons, setShowIcons ] = useState( false );

	return (
		<div className="mt-5">
			<span className="text-sm">{ __( 'Icon', 'genesis-custom-blocks' ) }</span>
			<Icon size={ 24 } icon={ getIconComponent( block.icon ) } />
			<button
				className="block-properties-icon-button"
				onClick={ () => {
					setShowIcons( ( current ) => ! current );
				} }
			>
				{ showIcons ? __( 'Close', 'genesis-custom-blocks' ) : __( 'Choose', 'genesis-custom-blocks' ) }
			</button>
			{ showIcons
				? <div role="listbox" id="block-icon" className="flex flex-wrap" aria-label={ __( 'Icons', 'genesis-custom-blocks' ) } >
					{
						Object.keys( blockIcons ).map( ( iconName, index ) => {
							const snakeCaseIconName = pascalCaseToSnakeCase( iconName );

							return (
								<div key={ `block-icon-item-${ index }` } className="block_icon_item">
									<button
										type="button"
										role="option"
										aria-selected={ block.icon === snakeCaseIconName }
										onClick={ () => {
											changeBlock( 'icon', snakeCaseIconName );
										} }
									>
										{ /* eslint-disable-next-line import/namespace */ }
										<Icon size={ 24 } icon={ blockIcons[ iconName ] } />
									</button>
								</div>
							);
						} )
					}
				</div>
				: null
			}
		</div>
	);
};

export default IconSection;
