/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Fields, GcbInspector, Preview } from './';
import { getIconComponent } from '../../common/helpers';

/**
 * The editor component for the block.
 *
 * @param {Object} props The props of this component.
 * @param {Object} props.blockProps The block's props.
 * @param {Object} props.block The block.
 * @return {React.ReactElement} The editor display.
 */
const Edit = ( { blockProps, block } ) => {
	const { attributes, className, isSelected } = blockProps;

	return (
		<>
			<GcbInspector blockProps={ blockProps } block={ block } />
			<div className={ className } key={ `form-controls-${ block.name }` } >
				{ isSelected ? (
					<div className="block-form">
						<h3>
							<Icon size={ 24 } icon={ getIconComponent( block.icon ) } />
							{ block.title }
						</h3>
						<Fields
							key={ `${ block.name }-fields` }
							fields={ block.fields }
							parentBlockProps={ blockProps }
							parentBlock={ blockProps }
						/>
					</div>
				) : (
					<Preview
						blockName={ block.name }
						attributes={ attributes }
					/>
				) }
			</div>
		</>
	);
};

export default Edit;
