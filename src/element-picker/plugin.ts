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
			const cols = 18;
			const rows = 3;
			const grid = new ButtonGridController(args.document, {
				size: [cols, rows],
				cellConfig: (x, y) => ({
					title: ELEMENTS[y][x] ?? '',
				}),
			});

			// Hide buttons for empty cells
			grid.cellControllers.forEach((cc, i) => {
				const x = i % cols;
				const y = Math.floor(i / cols);
				if (!ELEMENTS[y][x]) {
					cc.viewProps.set('disabled', true);
					cc.view.element.style.visibility = 'hidden';
				}
			});

			// Adjust column widths based on text length
			const colWidths = [] as number[];
			for (let x = 0; x < cols; x++) {
				let maxLen = 0;
				for (let y = 0; y < rows; y++) {
					const sym = ELEMENTS[y][x];
					if (sym) {
						maxLen = Math.max(maxLen, sym.length);
					}
				}
				colWidths.push(Math.max(1, maxLen));
			}
			grid.view.element.style.gridTemplateColumns = colWidths
				.map((l) => `${l}fr`)
				.join(' ');
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
