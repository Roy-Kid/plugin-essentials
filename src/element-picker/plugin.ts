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
	rows?: number;
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

const COMPACT_TABLE: string[][] = [
	['H', 'He'],
	['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
];

function buildRows(rowCount: number): string[][] {
	if (rowCount <= 2) {
		return COMPACT_TABLE.slice(0, rowCount).map((r) => r.slice());
	}
	return FULL_TABLE.slice(0, rowCount).map((r) => r.map((v) => v ?? ''));
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
			const rows = Math.max(1, Math.min(3, args.params.rows ?? 3));
			const data = buildRows(rows);
			const picker = new ElementPickerController(args.document, {
				rows: data,
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
