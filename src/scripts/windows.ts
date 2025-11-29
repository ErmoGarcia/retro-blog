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
	statusBar: HTMLElement;
	movingTarget: HTMLElement;
	closeIcon: HTMLElement;
	maximizeIcon: HTMLElement;
	minimizeIcon: HTMLElement;

	homebarButton: HTMLElement;

	maximized = false;
	minimized = false;

	title: string;
	href: string;

	isWindow = true; // so other frames can recognize it

	static [Symbol.hasInstance](obj: any) {
		if (obj.isWindow) return true;
		return false;
	}

	constructor(href: string, title: string) {
		this.title = title;
		this.href = href;

		const w = document.createElement('div');
		w.classList = "window absolute bg-wild-sand-100 select-none ring-2 ring-denim-800/80";
		w.onpointerdown = () => this.focus();

		const wb = document.createElement('div');
		wb.classList = "relative w-full h-full flex flex-col p-2";

		this._addResizeBorders(wb);

		this.statusBar = document.createElement('div');
		this.statusBar.classList = "window-status-bar pb-2 bg-denim-600 flex gap-2 justify-end";

		this.movingTarget = document.createElement('span');
		this.movingTarget.classList = "w-full";
		this.movingTarget.onpointerdown = (event) => handleWindowDragging(this, event as PointerEvent);
		this.statusBar.append(this.movingTarget);

		const notMinizmizedStyles = ["inset-shadow-sm", "inset-shadow-wild-sand-800"];
		this.minimizeIcon = document.createElement('button');
		this.minimizeIcon.innerText = "Minimize";
		this.minimizeIcon.classList = "bg-wild-sand-300 p-1 cursor-pointer";
		this.minimizeIcon.onclick = () => this.toggleMinimized(notMinizmizedStyles);
		this.statusBar.append(this.minimizeIcon);

		this.maximizeIcon = document.createElement('button');
		this.maximizeIcon.innerText = "Maximize";
		this.maximizeIcon.classList = "bg-wild-sand-300 p-1 cursor-pointer";
		this.maximizeIcon.onclick = () => this.toggleMaximized();
		this.statusBar.append(this.maximizeIcon);

		this.closeIcon = document.createElement('button');
		this.closeIcon.innerText = "Close";
		this.closeIcon.classList = "bg-red-500 p-1 cursor-pointer";
		this.closeIcon.onclick = () => this.close();
		this.statusBar.append(this.closeIcon);

		const content = document.createElement('div');
		content.classList = "window-content w-full h-full";
		const frame = document.createElement('iframe');
		frame.classList = "w-full h-full";
		frame.src = this.href;
		frame.title = this.title;
		frame.onload = () => {
			if (!frame.contentDocument) return;
			frame.contentDocument.onpointerdown = () => this.focus();
		};
		content.append(frame);

		w.append(wb);
		wb.append(this.statusBar);
		wb.append(content);

		this.html = w;
		this.width = windowDefaults.width;
		this.height = windowDefaults.height;
		this.html.style.top = desktop.height / 2 - windowDefaults.height / 2 + "px";
		this.html.style.left = desktop.width / 2 - windowDefaults.width / 2 + "px";

		this.homebarButton = document.createElement('button');
		this.homebarButton.innerText = this.title;
		this.homebarButton.classList.add("px-2", "py-1", "bg-wild-sand-300", ...notMinizmizedStyles);
		this.homebarButton.onclick = () => this.toggleMinimized(notMinizmizedStyles);
	}

	_addResizeBorders(wb: HTMLElement) {
		const borders = Array.from(Array(8), () => document.createElement('div'));
		borders[0].classList.add("hover:cursor-n-resize", "top-0", "left-0", "right-0", "h-2");
		borders[1].classList.add("hover:cursor-w-resize", "top-0", "left-0", "bottom-0", "w-2");
		borders[2].classList.add("hover:cursor-e-resize", "top-0", "right-0", "bottom-0", "w-2");
		borders[3].classList.add("hover:cursor-s-resize", "left-0", "right-0", "bottom-0", "h-2");
		borders[4].classList.add("hover:cursor-nw-resize", "top-0", "left-0", "w-2", "h-2");
		borders[5].classList.add("hover:cursor-ne-resize", "top-0", "right-0", "w-2", "h-2");
		borders[6].classList.add("hover:cursor-sw-resize", "bottom-0", "left-0", "w-2", "h-2");
		borders[7].classList.add("hover:cursor-se-resize", "bottom-0", "right-0", "w-2", "h-2");
		borders[0].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, undefined, resizeTop);
		borders[1].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeRight, undefined);
		borders[2].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeLeft, undefined);
		borders[3].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, undefined, resizeBottom);
		borders[4].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeLeft, resizeTop);
		borders[5].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeRight, resizeTop);
		borders[6].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeLeft, resizeBottom);
		borders[7].onpointerdown = (event: Event) => handleResize(this, event as PointerEvent, resizeRight, resizeBottom);
		borders.forEach(border => {
			border.ondragstart = () => false;
			border.classList.add("absolute", "bg-denim-600");
		})
		wb.append(...borders);
	}

	get width() {
		return +this.html.style.width.replace("%", "").replace("px", "");
	}

	get height() {
		return +this.html.style.height.replace("%", "").replace("px", "");
	}

	set width(width: number | string) {
		if (typeof width === "string") {
			this.html.style.width = width;
		} else if (typeof width === "number") {
			if (isNaN(width)) return
			this.html.style.width = `${width}px`;
		} else {
			throw Error(`Wrong width type: ${width}`);
		}
	}

	set height(height: number | string) {
		if (typeof height === "string") {
			this.html.style.height = height;
		} else if (typeof height === "number") {
			if (isNaN(height)) return
			this.html.style.height = `${height}px`;
		} else {
			throw Error(`Wrong height type: ${height}`);
		}
	}

	get position() {
		return {
			x: +this.html.style.left.replace("%", "").replace("px", ""),
			y: +this.html.style.top.replace("%", "").replace("px", ""),
		}
	}

	set z(zIndex: number) {
		console.log(zIndex);
		// this.html.classList.add("z-" + zIndex);
		this.html.style.zIndex = String(1000 + zIndex);
	}

	move(x: number, y: number) {
		if (this.maximized) return false;
		this.html.style.left = (this.position.x + x) + "px";
		this.html.style.top = (this.position.y + y) + "px";
		return true;
	}

	attachTo(target: HTMLElement) {
		target.append(this.html);
	}

	dettach() {
		this.html.remove()
		this.homebarButton.remove();
	}

	open() {
		window.parent.document.dispatchEvent(new CreateWindowEvent(this));
	}

	close() {
		window.parent.document.dispatchEvent(new CloseWindowEvent(this));
	}

	toggleMaximized() {
		this.maximized = !this.maximized;
		if (this.maximized) {
			this.html.style.top = "0";
			this.html.style.left = "0";
			this.width = "100%";
			this.height = "100%";
			this.maximizeIcon.innerText = "Unmaximize";
			return
		}
		this.html.style.top = `${desktop.height / 2 - windowDefaults.height / 2}px`;
		this.html.style.left = `${desktop.width / 2 - windowDefaults.width / 2}px`;
		this.width = windowDefaults.width;
		this.height = windowDefaults.height;
		this.maximizeIcon.innerText = "Maximize";
	}

	toggleMinimized(notMinizmizedStyles: string[]) {
		this.minimized = !this.minimized;
		this.html.hidden = this.minimized;
		if (this.minimized) {
			this.homebarButton.classList.remove(...notMinizmizedStyles);
		} else {
			this.homebarButton.classList.add(...notMinizmizedStyles);
		}
	}

	focus() {
		window.parent.document.dispatchEvent(new FocusWindowEvent(this));
	}
}

export enum WindowAction {
	create = "windowCreated",
	close = "windowClosed",
	focus = "windowFocused",
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

export class FocusWindowEvent extends Event {
	window: Window;

	constructor(window: Window) {
		super(WindowAction.focus);
		this.window = window;
	}
}

function handleWindowDragging(window: Window, event: PointerEvent) {
	window.html.setPointerCapture(event.pointerId);
	let initialX = event.clientX;
	let initialY = event.clientY;

	const releaseWindow = () => {
		window.html.onpointermove = null;
		window.html.onpointerup = null;
	};

	window.html.onpointermove = (event) => {
		let xMovement = event.clientX - initialX;
		let yMovement = event.clientY - initialY;
		window.move(xMovement, yMovement);
		initialX = event.clientX;
		initialY = event.clientY;
	};

	window.html.onpointerup = releaseWindow;
}

type ResizeFunction = (w: Window, d: number) => void;

function resizeTop(window: Window, distance: number) {
	window.move(0, distance);
	window.height = +window.height - distance;
}

function resizeLeft(window: Window, distance: number) {
	window.move(distance, 0);
	window.width = +window.width - distance;
}

function resizeRight(window: Window, distance: number) {
	window.width = +window.width + distance;
}

function resizeBottom(window: Window, distance: number) {
	window.height = +window.height + distance;
}

function handleResize(window: Window, event: PointerEvent, resizeX?: ResizeFunction, resizeY?: ResizeFunction) {
	window.html.setPointerCapture(event.pointerId);
	let initialX = event.clientX;
	let initialY = event.clientY;


	window.html.onpointermove = (event) => {
		let xMovement = event.clientX - initialX;
		let yMovement = event.clientY - initialY;
		resizeX && resizeX(window, xMovement);
		resizeY && resizeY(window, yMovement);
		initialX = event.clientX;
		initialY = event.clientY;
	};

	window.html.onpointerup = () => {
		window.html.onpointermove = null;
		window.html.onpointerup = null;
	};
}
