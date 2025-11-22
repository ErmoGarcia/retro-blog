const windowDefaults = {
	width: 900,
	height: 600,
}

const desktop = {
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
		statusBar.classList = "h-4 bg-denim-600";

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
		window.parent.document.dispatchEvent(new WindowEvent(this));
	}

	open() {
		window.parent.document.body.append(this.html);
	}
}

export class WindowEvent extends Event {
	window: Window;

	constructor(window: Window) {
		super("windowCreated");
		this.window = window;
	}
}
