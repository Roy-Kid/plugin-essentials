import {
	Blade,
	BladeController,
	LabelController,
	LabelProps,
	LabelView,
} from '@tweakpane/core';

import {ElementPickerController} from './element-picker.js';

interface Config {
	blade: Blade;
	labelProps: LabelProps;
	valueController: ElementPickerController;
}

export class ElementPickerBladeController extends BladeController<LabelView> {
	public readonly labelController: LabelController<ElementPickerController>;
	public readonly valueController: ElementPickerController;

	constructor(doc: Document, config: Config) {
		const vc = config.valueController;
		const lc = new LabelController(doc, {
			blade: config.blade,
			props: config.labelProps,
			valueController: vc,
		});
		super({
			blade: config.blade,
			view: lc.view,
			viewProps: vc.viewProps,
		});

		this.valueController = vc;
		this.labelController = lc;
	}
}
