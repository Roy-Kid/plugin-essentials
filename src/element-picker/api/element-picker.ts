import {BladeApi, ButtonController, Emitter} from '@tweakpane/core';

import {ButtonCellApi} from '../../button-grid/api/button-cell.js';
import {TpButtonGridEvent} from '../../button-grid/api/tp-button-grid-event.js';
import {ElementPickerBladeController} from '../controller/element-picker-blade.js';

interface ElementPickerApiEvents {
	click: {
		event: TpButtonGridEvent;
	};
}

export class ElementPickerApi extends BladeApi<ElementPickerBladeController> {
	private emitter_: Emitter<ElementPickerApiEvents>;
	private cellToApiMap_: Map<ButtonController, ButtonCellApi> = new Map();

	constructor(controller: ElementPickerBladeController) {
		super(controller);

		this.emitter_ = new Emitter();

		const vc = controller.valueController;
		vc.cellControllers.forEach((cc) => {
			const api = new ButtonCellApi(cc);
			this.cellToApiMap_.set(cc, api);
			cc.emitter.on('click', () => {
				const coord = vc.cellCoord(cc);
				if (!coord) {
					return;
				}
				this.emitter_.emit('click', {
					event: new TpButtonGridEvent(this, api, coord),
				});
			});
		});
	}

	public on<EventName extends keyof ElementPickerApiEvents>(
		eventName: EventName,
		handler: (ev: ElementPickerApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
