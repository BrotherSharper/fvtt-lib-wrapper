// SPDX-License-Identifier: LGPL-3.0-or-later
// Copyright © 2020 fvtt-lib-wrapper Rui Pinheiro

'use strict';

import {MODULE_ID} from '../consts.js';



// Find currently executing module name (that is not libWrapper)
export function get_current_module_name() {
	const stack_trace = Error().stack;
	if(!stack_trace)
		return null;

	const matches = stack_trace.matchAll(/(?<=\/modules\/).+?(?=\/)/ig);
	if(!matches)
		return null;

	for(let match of matches) {
		match = match[0];

		if(!match || match == MODULE_ID || !(game?.modules?.has(match) ?? true))
			continue;

		return match;
	}

	return null;
}


// HACK: The browser doesn't expose all global variables (e.g. 'Game') inside globalThis, but it does to an eval
// We declare this helper here so that the eval does not have access to the anonymous function scope
const __eval_copy = eval;
export function get_global_variable(varname) {
	// Basic check to make sure we don't do anything too crazy by accident
	if(varname == 'varname' || !/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(varname))
		throw `libWrapper: Invalid identifier ${varname}`;

	return globalThis[varname] ?? __eval_copy(varname);
}


// Shared list of active wrappers
export const WRAPPERS = new Set();