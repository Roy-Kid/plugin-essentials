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

		config.rows.forEach((row, y) => {
			const grid = new ButtonGridController(doc, {
				size: [row.length, 1],
				cellConfig: (x) => ({title: row[x]}),
			});
			grid.view.element.style.gridTemplateColumns = `repeat(${row.length}, 2ch)`;
			grid.cellControllers.forEach((cc, x) => {
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
