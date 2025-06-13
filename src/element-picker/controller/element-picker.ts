import {
	ButtonController,
	Controller,
	PlainView,
	ViewProps,
} from '@tweakpane/core';

import {ButtonGridController} from '../../button-grid/controller/button-grid.js';

export interface ElementPickerControllerConfig {
	rows: string[][];
}

export class ElementPickerController implements Controller<PlainView> {
	public readonly view: PlainView;
	public readonly viewProps: ViewProps;
	public readonly rowControllers: ButtonGridController[] = [];
	public readonly cellControllers: ButtonController[] = [];
	private coordMap_: Map<ButtonController, [number, number]> = new Map();

	constructor(doc: Document, config: ElementPickerControllerConfig) {
		this.viewProps = ViewProps.create();
		this.view = new PlainView(doc, {
			viewProps: this.viewProps,
			viewName: 'elpick',
		});

		const colCount = Math.max(...config.rows.map((r) => r.length));
		const colWidths: number[] = [];
		for (let x = 0; x < colCount; x++) {
			let w = 1;
			config.rows.forEach((row) => {
				const t = row[x];
				if (t) {
					w = Math.max(w, t.length);
				}
			});
			colWidths[x] = w;
		}

		config.rows.forEach((row, y) => {
			const grid = new ButtonGridController(doc, {
				size: [row.length, 1],
				cellConfig: (x) => ({title: row[x] ?? ''}),
			});
			grid.view.element.style.gridTemplateColumns = row
				.map((_, i) => `${colWidths[i]}ch`)
				.join(' ');
			grid.cellControllers.forEach((cc, x) => {
				if (!row[x]) {
					cc.viewProps.set('hidden', true);
				}
				this.coordMap_.set(cc, [x, y]);
				this.cellControllers.push(cc);
			});
			this.rowControllers.push(grid);
			this.view.element.appendChild(grid.view.element);
		});

		this.viewProps.handleDispose(() => {
			this.rowControllers.forEach((rc) => {
				rc.viewProps.set('disposed', true);
			});
		});
	}

	public cellCoord(cc: ButtonController): [number, number] | undefined {
		return this.coordMap_.get(cc);
	}
}
