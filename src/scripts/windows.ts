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

	maximized = false;
	minimized = false;

	constructor(href: string, title: string) {
		const w = document.createElement('div');
		w.classList = "window absolute bg-wild-sand-100 select-none ring-2 ring-denim-800/80";

		const wb = document.createElement('div');
		wb.classList = "relative w-full h-full flex flex-col p-2";

		this._addResizeBorders(wb);

		this.statusBar = document.createElement('div');
		this.statusBar.classList = "window-status-bar pb-2 bg-denim-600 flex gap-2 justify-end";

		this.movingTarget = document.createElement('span');
		this.movingTarget.classList = "w-full";
		this.movingTarget.onpointerdown = (event) => handleWindowDragging(this, event as PointerEvent);
		this.statusBar.append(this.movingTarget);

		this.maximizeIcon = document.createElement('button');
		this.maximizeIcon.innerText = "Maximize";
		this.maximizeIcon.classList = "bg-red-500 p-1 cursor-pointer";
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
		frame.src = href;
		frame.title = title;
		content.append(frame);

		w.append(wb);
		wb.append(this.statusBar);
		wb.append(content);

		this.html = w;
		this.width = windowDefaults.width;
		this.height = windowDefaults.height;
		this.html.style.top = desktop.height / 2 - windowDefaults.height / 2 + "px";
		this.html.style.left = desktop.width / 2 - windowDefaults.width / 2 + "px";
	}

	_addResizeBorders(wb: HTMLElement) {
		type BorderElement = {
			x?: ResizeFunction,
			y?: ResizeFunction,
			element?: HTMLElement
		};

		const matrix: BorderElement[][] = [
			[{ x: resizeLeft, y: resizeTop }, { y: resizeTop }, { x: resizeRight, y: resizeTop }],
			[{ x: resizeLeft }, { y: resizeRight }],
			[{ x: resizeLeft, y: resizeBottom }, { y: resizeBottom }, { x: resizeRight, y: resizeBottom }]
		];

		matrix.flat().forEach(elem => {
			const border = document.createElement('div');
			border.classList = "absolute db-denim-600";
			wb.append(border);
			elem["element"] = border;
		})
		const wbTop = document.createElement('div');
		const wbLeft = document.createElement('div');
		const wbRight = document.createElement('div');
		const wbBottom = document.createElement('div');
		const wbTopLeft = document.createElement('div');
		const wbTopRight = document.createElement('div');
		const wbBottomLeft = document.createElement('div');
		const wbBottomRight = document.createElement('div');
		wbTop.classList = "hover:cursor-n-resize absolute top-0 left-0 right-0 h-2 bg-denim-600"
		wbLeft.classList = "hover:cursor-w-resize absolute top-0 left-0 bottom-0 w-2 bg-denim-600"
		wbRight.classList = "hover:cursor-e-resize absolute top-0 right-0 bottom-0 w-2 bg-denim-600"
		wbBottom.classList = "hover:cursor-s-resize absolute left-0 right-0 bottom-0 h-2 bg-denim-600"
		wbTopLeft.classList = "hover:cursor-nw-resize absolute top-0 left-0 w-2 h-2 bg-denim-600"
		wbTopRight.classList = "hover:cursor-ne-resize absolute top-0 right-0 w-2 h-2 bg-denim-600"
		wbBottomLeft.classList = "hover:cursor-sw-resize absolute bottom-0 left-0 w-2 h-2 bg-denim-600"
		wbBottomRight.classList = "hover:cursor-se-resize absolute bottom-0 right-0 w-2 h-2 bg-denim-600"
		wbTop.onpointerdown = (event) => handleResize(this, event as PointerEvent, undefined, resizeTop);
		wbTop.ondragstart = () => false;
		wbLeft.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeLeft, undefined);
		wbLeft.ondragstart = () => false;
		wbRight.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeRight, undefined);
		wbRight.ondragstart = () => false;
		wbBottom.onpointerdown = (event) => handleResize(this, event as PointerEvent, undefined, resizeBottom);
		wbBottom.ondragstart = () => false;
		wbTopLeft.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeLeft, resizeTop);
		wbTopLeft.ondragstart = () => false;
		wbTopRight.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeRight, resizeTop);
		wbTopRight.ondragstart = () => false;
		wbBottomRight.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeRight, resizeBottom);
		wbBottomRight.ondragstart = () => false;
		wbBottomLeft.onpointerdown = (event) => handleResize(this, event as PointerEvent, resizeLeft, resizeBottom);
		wbBottomLeft.ondragstart = () => false;
		wb.append(wbTop, wbLeft, wbRight, wbBottom, wbTopLeft, wbTopRight, wbBottomLeft, wbBottomRight);
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
	}

	open() {
		window.parent.document.dispatchEvent(new CreateWindowEvent(this));
	}

	close() {
		window.parent.document.dispatchEvent(new CloseWindowEvent(this));
	}

	toggleMaximized() {
		console.log(this.maximized)
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
