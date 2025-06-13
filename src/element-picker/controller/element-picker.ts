import {
	ButtonController,
	ButtonPropsObject,
	Controller,
	PlainView,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

export interface ElementPickerControllerConfig {
	table: (string | null)[][];
}

export class ElementPickerController implements Controller<PlainView> {
	public readonly view: PlainView;
	public readonly viewProps: ViewProps;
	private coordMap_: Map<ButtonController, [number, number]> = new Map();

	constructor(doc: Document, config: ElementPickerControllerConfig) {
		this.viewProps = ViewProps.create();
		this.view = new PlainView(doc, {
			viewProps: this.viewProps,
			viewName: 'elpick',
		});
		const w = config.table[0].length;
		for (let y = 0; y < config.table.length; y++) {
			for (let x = 0; x < config.table[y].length; x++) {
				const el = config.table[y][x];
				const bc = new ButtonController(doc, {
					props: ValueMap.fromObject<ButtonPropsObject>({
						title: el ?? '',
					}),
					viewProps: ViewProps.create(),
				});
				if (el === null) {
					// TODO: placeholder, invisible and disabled
					bc.viewProps.set('hidden', true);
				}
				this.coordMap_.set(bc, [x, y]);
			}
		}

		this.viewProps = ViewProps.create();
		this.viewProps.handleDispose(() => {
			this.coordMap_.forEach((_, cc) => {
				cc.viewProps.set('disposed', true);
			});
		});

		this.view = new PlainView(doc, {
			viewProps: this.viewProps,
			viewName: 'btngrid',
		});
		this.view.element.style.gridTemplateColumns = `repeat(${w}, 1fr)`;

		this.coordMap_.forEach((_, bc) => {
			this.view.element.appendChild(bc.view.element);
		});
	}

	public cellCoord(cc: ButtonController): [number, number] | undefined {
		return this.coordMap_.get(cc);
	}

	public getCell([x, y]: [number, number]): ButtonController | undefined {
		for (const [bc, coord] of this.coordMap_) {
			if (coord[0] === x && coord[1] === y) {
				return bc;
			}
		}
		return undefined;
	}

	get cellControllers(): ButtonController[] {
		return Array.from(this.coordMap_.keys());
	}
}
