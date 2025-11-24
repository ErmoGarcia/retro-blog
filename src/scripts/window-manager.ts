import { Window, windowDefaults, desktop } from './windows.ts';

const windowOffset = {
	x: 20,
	y: 20,
};


class WindowManager {
	desktop: HTMLElement;
	windowStack: Window[] = [];

	constructor() {
		this.desktop = document.querySelector(".desktop")!;
	}

	addWindow(w: Window) {
		const top = desktop.height / 2 - windowDefaults.height / 2 + this.windowStack.length * windowOffset.y;
		const left = desktop.width / 2 - windowDefaults.width / 2 + this.windowStack.length * windowOffset.x;
		w.html.style.top = `${top}px`;
		w.html.style.left = `${left}px`;

		this.windowStack.push(w);
		w.attachTo(this.desktop);
		console.log(this.windowStack);
	}
	removeWindow(w: Window) {
		this.windowStack = this.windowStack.filter(window => window !== w);
		w.dettach();
		console.log(this.windowStack);
	}
}

export const wm = new WindowManager();
