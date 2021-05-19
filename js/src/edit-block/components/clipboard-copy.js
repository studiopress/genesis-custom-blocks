/**
 * External dependencies
 */
import * as React from 'react';

/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import { useState, useEffect } from '@wordpress/element';
import { Icon, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useCopyToClipboard } from '../hooks';

/**
 * @typedef {Object} ClipboardCopyProps The component props.
 * @property {string} text The text to copy.
 */

/**
 * Copies text to the clipboard, and shows feedback on copying.
 *
 * Forked from the Gutenberg component ClipboardButton.
 * https://github.com/WordPress/gutenberg/blob/1103f7ba9f20fada5af22cb6d86bd26e75defea6/packages/components/src/clipboard-button/index.js
 *
 * @param {ClipboardCopyProps} props The component props.
 * @return {React.ReactElement} Copies text to the clipboard.
 */
const ClipboardCopy = ( { text } ) => {
	const [ hasCopied, setHasCopied ] = useState( false );
	let timer;

	useEffect( () => {
		return () => clearTimeout( timer );
	}, [ timer ] );

	// Backwards compatibility for before useCopyToClipboard() existed.
	const ref = useCopyToClipboard(
		text,
		() => {
			speak( sprintf(
				/* translators: %1$s: the text that was copied */
				__( 'Copied the text %1$s', 'genesis-custom-blocks' ),
				text
			) );

			setHasCopied( true );
			clearTimeout( timer );
			timer = setTimeout( () => {
				setHasCopied( false );
			}, 2000 );
		}
	);

	const label = sprintf(
		/* translators: %1$s: the field name */
		__( 'Copy the field name of %1$s', 'genesis-custom-blocks' ),
		text
	);

	return (
		<button
			aria-label={ label }
			ref={ ref }
		>
			{ hasCopied
				? <Icon size={ 20 } icon={ check } />
				: <svg className="h-4 w-4 fill-current ml-1" fill="currentColor" viewBox="0 0 20 20">
					<path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
					<path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
				</svg>
			}
		</button>
	);
};

export default ClipboardCopy;
