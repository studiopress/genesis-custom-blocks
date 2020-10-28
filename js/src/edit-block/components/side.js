/**
 * Internal dependencies
 */
import { FieldSettings } from './';

const Side = () => {
	return (
		<div className="inspector flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button className="flex items-center h-12 px-5 text-sm focus:outline-none">Block</button>
				<button className="flex items-center h-12 px-5 text-sm font-semibold border-b-4 border-blue-600 focus:outline-none">Field</button>
			</div>
			<FieldSettings />
		</div>
	);
};

export default Side;
