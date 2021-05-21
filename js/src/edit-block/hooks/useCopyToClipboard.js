/**
 * External dependencies
 */
import Clipboard from 'clipboard';

/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { useRef } from '@wordpress/element';

function useUpdatedRef( value ) {
	const ref = useRef( value );
	ref.current = value;
	return ref;
}

/**
 * Copies the given text to the clipboard when the element is clicked.
 *
 * Forked from Gutenberg, with only minor changes.
 *
 * @see https://github.com/WordPress/gutenberg/blob/1103f7ba9f20fada5af22cb6d86bd26e75defea6/packages/compose/src/hooks/use-copy-to-clipboard/index.js
 *
 * @param {string} text        The text to copy. Use a function if not
 *                             already available and expensive to compute.
 * @param {Function} onSuccess Called when to text is copied.
 *
 * @return {import('react').RefObject} A ref to assign to the target element.
 */
export default function useCopyToClipboard( text, onSuccess ) {
	// Store the dependencies as refs and continuesly update them so they're
	// fresh when the callback is called.
	const textRef = useUpdatedRef( text );
	const onSuccesRef = useUpdatedRef( onSuccess );
	return useRefEffect( ( node ) => {
		// Clipboard listens to click events.
		const clipboard = new Clipboard( node, {
			text() {
				return typeof textRef.current === 'function'
					? textRef.current()
					: textRef.current;
			},
		} );

		clipboard.on( 'success', ( { clearSelection } ) => {
			// Clearing selection will move focus back to the triggering
			// button, ensuring that it is not reset to the body, and
			// further that it is kept within the rendered node.
			clearSelection();
			// Handle ClipboardJS focus bug, see
			// https://github.com/zenorocha/clipboard.js/issues/680
			node.focus();

			if ( onSuccesRef.current ) {
				onSuccesRef.current();
			}
		} );

		return () => {
			clipboard.destroy();
		};
	}, [] );
}
