import {
	BaseBladeParams,
	BladePlugin,
	createPlugin,
	LabelPropsObject,
	parseRecord,
	ValueMap,
} from '@tweakpane/core';

import {ElementPickerApi} from './api/element-picker.js';
import {ElementPickerController} from './controller/element-picker.js';
import {ElementPickerBladeController} from './controller/element-picker-blade.js';

export interface ElementPickerBladeParams extends BaseBladeParams {
	view: 'elementpicker';
	label?: string;
	mode?: 'full' | 'compact';
}

const FULL_TABLE: (string | null)[][] = [
	[
		'H',
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		'He',
	],
	[
		'Li',
		'Be',
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		'B',
		'C',
		'N',
		'O',
		'F',
		'Ne',
	],
	[
		'Na',
		'Mg',
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		'Al',
		'Si',
		'P',
		'S',
		'Cl',
		'Ar',
	],
];

const SKIP_START = 2;
const SKIP_END = 11;

function getTable(mode: 'full' | 'compact'): (string | null)[][] {
	if (mode === 'full') {
		return FULL_TABLE;
	} else if (mode === 'compact') {
		return FULL_TABLE.slice(0, 2).map((row) =>
			row.map((el, i) => (i < SKIP_START || i > SKIP_END ? null : el)),
		);
	} else {
		throw new Error(`Unknown mode: ${mode}`);
	}
}

export const ElementPickerBladePlugin: BladePlugin<ElementPickerBladeParams> =
	createPlugin({
		id: 'elementpicker',
		type: 'blade',

		accept(params) {
			const result = parseRecord<ElementPickerBladeParams>(params, (p) => ({
				view: p.required.constant('elementpicker'),
				label: p.optional.string,
				rows: p.optional.number,
			}));
			return result ? {params: result} : null;
		},
		controller(args) {
			const mode = args.params.mode ?? 'full';
			const table = getTable(mode);
			const picker = new ElementPickerController(args.document, {
				table: table,
			});
			return new ElementPickerBladeController(args.document, {
				blade: args.blade,
				labelProps: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				valueController: picker,
			});
		},
		api(args) {
			if (args.controller instanceof ElementPickerBladeController) {
				return new ElementPickerApi(args.controller);
			}
			return null;
		},
	});
