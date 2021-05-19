/**
 * External dependencies
 */
import * as React from 'react';
import classNames from 'classnames';

/**
 * @typedef {Object} NoticeProps The component props.
 * @property {React.ReactChild[]} children The component's children.
 * @property {string} [className] Additional class(es).
 */

/**
 * A simple notice.
 *
 * @param {NoticeProps} props
 * @return {React.ReactElement} The front-end preview.
 */
const Notice = ( { children, className } ) => (
	<div
		className={ classNames(
			className,
			'p-5 mb-2 bg-blue-100 text-blue-700 border-l-4 border-blue-700 rounded-sm'
		) }
	>
		<p className="text-sm ml-2">
			{ children }
		</p>
	</div>
);

export default Notice;
