export const windowDefaults = {
	width: 900,
	height: 600,
}

export const desktop = {
	height: window.parent.document.documentElement.clientHeight,
	width: window.parent.document.documentElement.clientWidth,
}

export class Window {
	html: HTMLElement;

	constructor(href: string, title: string) {
		const w = document.createElement('div');
		w.className = "window";
		w.classList = "absolute p2 bg-wild-sand-100";
		w.style.top = `${desktop.height / 2 - windowDefaults.height / 2}px`;
		w.style.left = `${desktop.width / 2 - windowDefaults.width / 2}px`;

		const wb = document.createElement('div');
		wb.classList = "border-4 border-denim-600";

		const statusBar = document.createElement('div');
		statusBar.className = "window-status-bar";
		statusBar.classList = "p-1 bg-denim-600 flex justify-end";

		const closeIcon = document.createElement('button');
		closeIcon.innerText = "Close";
		closeIcon.classList = "bg-red-500 p-1 cursor-pointer";
		closeIcon.onclick = () => this.close();
		statusBar.append(closeIcon)

		const content = document.createElement('div');
		content.classList = "p-2";
		content.style.width = `${windowDefaults.width}px`;
		content.style.height = `${windowDefaults.height}px`;
		const frame = document.createElement('iframe');
		frame.classList = "w-full h-full";
		frame.src = href;
		frame.title = title;
		content.append(frame);

		w.append(wb);
		wb.append(statusBar);
		wb.append(content);

		this.html = w;
	}

	attachTo(target: HTMLElement) {
		target.append(this.html);
	}

	dettach() {
		this.html.remove()
	}

	open() {
		window.parent.document.dispatchEvent(new CreateWindowEvent(this));
	}

	close() {
		window.parent.document.dispatchEvent(new CloseWindowEvent(this));
	}
}

export enum WindowAction {
	create = "windowCreated",
	close = "windowClosed",
}

export class WindowEvent extends Event {
	window: Window;

	constructor(window: Window, action: WindowAction) {
		super(action);
		this.window = window;
	}
}

export class CreateWindowEvent extends Event {
	window: Window;

	constructor(window: Window) {
		super(WindowAction.create);
		this.window = window;
	}
}

export class CloseWindowEvent extends Event {
	window: Window;

	constructor(window: Window) {
		super(WindowAction.close);
		this.window = window;
	}
}
