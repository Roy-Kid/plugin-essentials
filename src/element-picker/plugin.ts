import {
	BaseBladeParams,
	BladePlugin,
	createPlugin,
	LabelPropsObject,
	parseRecord,
	ValueMap,
} from '@tweakpane/core';

import {ButtonGridApi} from '../button-grid/api/button-grid.js';
import {ButtonGridController} from '../button-grid/controller/button-grid.js';
import {ButtonGridBladeController} from '../button-grid/controller/button-grid-blade.js';

export interface ElementPickerBladeParams extends BaseBladeParams {
	view: 'elementpicker';
	label?: string;
}

const ELEMENTS: (string | null)[][] = [
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

export const ElementPickerBladePlugin: BladePlugin<ElementPickerBladeParams> =
	createPlugin({
		id: 'elementpicker',
		type: 'blade',

		accept(params) {
			const result = parseRecord<ElementPickerBladeParams>(params, (p) => ({
				view: p.required.constant('elementpicker'),
				label: p.optional.string,
			}));
			return result ? {params: result} : null;
		},
		controller(args) {
			const grid = new ButtonGridController(args.document, {
				size: [18, 3],
				cellConfig: (x, y) => ({
					title: ELEMENTS[y][x] ?? '',
				}),
			});
			grid.cellControllers.forEach((cc, i) => {
				const x = i % 18;
				const y = Math.floor(i / 18);
				if (!ELEMENTS[y][x]) {
					cc.viewProps.set('disabled', true);
				}
			});
			return new ButtonGridBladeController(args.document, {
				blade: args.blade,
				labelProps: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				valueController: grid,
			});
		},
		api(args) {
			if (args.controller instanceof ButtonGridBladeController) {
				return new ButtonGridApi(args.controller);
			}
			return null;
		},
	});
