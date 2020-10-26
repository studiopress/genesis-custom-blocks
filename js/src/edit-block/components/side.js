const Side = () => {
	return (
		<div className="inspector flex-shrink-0 flex flex-col border-l border-gray-300 overflow-scroll">
			<div className="flex w-full border-b border-gray-300">
				<button className="flex items-center h-12 px-5 text-sm focus:outline-none">Block</button>
				<button className="flex items-center h-12 px-5 text-sm font-semibold border-b-4 border-blue-600 focus:outline-none">Field</button>
			</div>
			<div className="p-4">
				<h4 className="text-sm font-semibold">Field Settings</h4>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-1">Field Label</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="text" id="setting-1" />
					<span className="block italic text-xs mt-1">A label or a title for this field.</span>
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-2">Field Name (slug)</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm font-mono" type="text" id="setting-2" />
					<span className="block italic text-xs mt-1">Single word, no spaces.</span>
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-3">Field Type</label>
					<select className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" name="" id="setting-3">
						<option value="">Text Field</option>
						<option value="">Number Field</option>
						<option value="">URL Field</option>
						<option value="">Color Field</option>
						<option value="">Select Field</option>
					</select>
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-4">Field Width</label>
					<div className="flex w-full border border-gray-600 rounded-sm mt-2">
						<button className="w-0 flex-grow h-8 rounded-sm text-sm focus:outline-none" id="setting-4">25%</button>
						<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">50%</button>
						<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">75%</button>
						<button className="w-0 flex-grow h-8 border-l border-gray-600 text-sm focus:outline-none">100%</button>
					</div>
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-5">Help Text</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="text" id="setting-5" />
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-6">Default Value</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="text" id="setting-6" />
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-7">Placeholder Text</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="text" id="setting-7" />
				</div>
				<div className="mt-5">
					<label className="text-sm" htmlFor="setting-8">Character Limit</label>
					<input className="flex items-center w-full h-8 rounded-sm border border-gray-600 mt-2 px-2 text-sm" type="number" id="setting-8" />
				</div>
				<div className="flex justify-between mt-5 border-t border-gray-300 pt-3">
					<button className="flex items-center bg-red-200 text-sm h-6 px-2 rounded-sm leading-none text-red-700 hover:bg-red-500 hover:text-red-100">Delete</button>
					<button className="flex items-center bg-blue-200 text-sm h-6 px-2 rounded-sm leading-none text-blue-700 hover:bg-blue-500 hover:text-blue-100">Duplicate</button>
				</div>
			</div>
		</div>
	);
};

export default Side;
