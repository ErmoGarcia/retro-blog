class WindowManager {
	windowStack: Window[] = [];
	defaultWindowSize = {
		width: 900,
		height: 600,
	};

	createWindow(href: string, title: string): Window {
		const w = new Window(href, title);
		this.windowStack.push(w);
		w.windowNode.id = `window-${this.windowStack.length}`
		return w;
	}
}

class Window {
	windowNode: HTMLElement;

	constructor(href: string, title: string) {
		const w = document.querySelector("#original-window");
		if (w === null) throw "Window not found";
		this.windowNode = w.cloneNode(true) as HTMLElement;

		const iframe = this.windowNode.querySelector("iframe");
		if (iframe === null) throw "Window has no iframe";
		iframe.src = href;
		iframe.title = title;

		this.windowNode.style.visibility = "visible";
		w.after(this.windowNode);
	}
}

export const wm = new WindowManager();
