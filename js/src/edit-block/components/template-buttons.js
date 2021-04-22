/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CSS_TEMPLATE_MODE, MARKUP_TEMPLATE_MODE } from '../constants';

/**
 * @typedef {Object} TemplateButtonsProps The component props.
 * @property {string} templateMode The currently selected template editing mode.
 * @property {function(string):void} setTemplateMode Sets the current template editing mode.
 */

/**
 * Buttons that select which of the template editors displays.
 *
 * @param {TemplateButtonsProps} props
 * @return {React.ReactElement} The Template buttons.
 */
const TemplateButtons = ( {
	templateMode,
	setTemplateMode,
} ) => {
	const buttonClass = 'w-40 h-12 px-4 text-sm focus:outline-none';

	return (
		<div className="flex">
			<button
				className={ buttonClass }
				onClick={ () => setTemplateMode( MARKUP_TEMPLATE_MODE ) }
			>
				<span
					className={ classNames( {
						'font-semibold': MARKUP_TEMPLATE_MODE === templateMode,
					} ) }
				>
					{ __( 'Markup', 'genesis-custom-blocks' ) }
				</span>
			</button>
			<button
				className={ buttonClass }
				onClick={ () => setTemplateMode( CSS_TEMPLATE_MODE ) }
			>
				<span
					className={ classNames( {
						'font-semibold': CSS_TEMPLATE_MODE === templateMode,
					} ) }
				>
					{ __( 'CSS', 'genesis-custom-blocks' ) }
				</span>
			</button>
		</div>
	);
};

export default TemplateButtons;
