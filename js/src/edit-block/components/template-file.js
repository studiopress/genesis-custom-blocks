/**
 * External dependencies
 */
import * as React from 'react';
import className from 'classnames';

/**
 * Internal dependencies
 */
import { ClipboardCopy } from './';
import { getTemplateParts } from '../helpers';

/**
 * @typedef {Object} TemplateFileProps The component props.
 * @property {string} templatePath The path of the template.
 * @property {string} [color] The color, 'gray' or 'blue'.
 */

/**
 * The top notice section.
 *
 * @param {TemplateFileProps} props
 * @return {React.ReactElement} The top notice.
 */
const TemplateFile = ( { templatePath, color = 'gray' } ) => {
	const [ basePath, fileName ] = getTemplateParts( templatePath );

	return (
		<>
			<span className={ className(
				'text-xs font-mono mr-1 truncate direction-rtl',
				'gray' === color ? 'text-gray-800' : 'text-blue-800'
			) }>
				{ basePath }
				<span
					className={ className(
						'bg-transparent border-b border-dashed',
						'gray' === color ? 'border-gray-700 hover:bg-gray-300' : 'border-blue-700 hover:bg-blue-300'
					) }
				>
					{ fileName }
				</span>
			</span>
			<ClipboardCopy text={ fileName } />
		</>
	);
};

export default TemplateFile;
