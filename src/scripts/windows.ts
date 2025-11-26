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
		w.classList = "window absolute p2 bg-wild-sand-100";

		const wb = document.createElement('div');
		wb.classList = "w-full h-full flex flex-col border-4 border-denim-600";

		this.statusBar = document.createElement('div');
		this.statusBar.classList = "window-status-bar p-1 bg-denim-600 flex justify-end";

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
		content.classList = "window-content w-full h-full p-2";
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
			this.html.style.width = `${width}px`;
		} else {
			throw Error(`Wrong width type: ${width}`);
		}
	}

	set height(height: number | string) {
		if (typeof height === "string") {
			this.html.style.height = height;
		} else if (typeof height === "number") {
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
		// if (event.relatedTarget === null) {
		// 	releaseWindow();
		// 	return
		// }
		let xMovement = event.clientX - initialX;
		let yMovement = event.clientY - initialY;
		window.move(xMovement, yMovement);
		initialX = event.clientX;
		initialY = event.clientY;
	};

	window.html.onpointerup = releaseWindow;
}
