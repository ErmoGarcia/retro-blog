import { Window, windowDefaults, desktop } from './windows.ts';

const windowOffset = {
	x: 20,
	y: 20,
};


class WindowManager {
	desktop: HTMLElement;
	homebar: HTMLElement;
	windowStack: Window[];

	constructor() {
		this.desktop = document.querySelector(".desktop")!;
		this.homebar = document.querySelector(".homebar")!;

		const windowStack: Window[] = [];
		this.windowStack = new Proxy(windowStack, {
			set: (target, prop, val, receiver) => {
				if (val instanceof Window) {
					val.z = Number(prop);
				}
				Reflect.set(target, prop, val, receiver);
				return true;
			},
		})
	}

	addWindow(w: Window) {
		const top = desktop.height / 2 - windowDefaults.height / 2 + this.windowStack.length * windowOffset.y;
		const left = desktop.width / 2 - windowDefaults.width / 2 + this.windowStack.length * windowOffset.x;
		w.html.style.top = `${top}px`;
		w.html.style.left = `${left}px`;

		this.windowStack.push(w);
		w.attachTo(this.desktop);

		this.homebar.append(w.homebarButton);
	}

	removeWindow(w: Window) {
		const index = this.windowStack.indexOf(w);
		if (index === -1) return
		this.windowStack.splice(index, 1);
		w.dettach();
	}

	focusWindow(w: Window) {
		const index = this.windowStack.indexOf(w);
		if (index === -1) return
		this.windowStack.splice(index, 1);
		this.windowStack.push(w);
	}
}

export const wm = new WindowManager();
