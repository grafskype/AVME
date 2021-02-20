const { ceil, random } = Math;
type CurveParams = [number, number, number, number, number, number];

class Position {
	constructor(public x: number, public y: number) {}
}

class Cell extends Position {
	public opacity: number = random();
	public speed: number = 0;

	constructor(x: number, y: number, public radius: number = 16) {
		super(x, y);
		this.opacity = this.opacity <= 0.4 ? 0.4 : this.opacity;
	}

	get topLeft(): Position {
		return {
			x: this.x - this.radius,
			y: this.y - this.radius
		};
	}

	get topRight(): Position {
		return {
			x: this.x + this.radius,
			y: this.y - this.radius
		};
	}

	get bottomRight(): Position {
		return {
			x: this.x + this.radius,
			y: this.y + this.radius
		};
	}

	get bottomLeft(): Position {
		return {
			x: this.x - this.radius,
			y: this.y - this.radius
		};
	}
}

const resizeCanvas = (canvas: HTMLCanvasElement): void => {
	const { innerWidth, innerHeight } = window;
	canvas.height = ceil(innerHeight);
	canvas.width = ceil(innerWidth);
};

const createCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	const ctx: CanvasRenderingContext2D = canvas.getContext(
		"2d"
	) as CanvasRenderingContext2D;

	(document.getElementById("root") as HTMLElement).appendChild(canvas);
	resizeCanvas(canvas);

	return [canvas, ctx];
};

const createCells = (): Cell[] => {
	const cells: Cell[] = [];

	for (let x = 0; x < ~~window.innerWidth; x += 16) {
		cells.push(new Cell(x, window.innerHeight - 16));
	}

	return cells;
};

const init = () => {
	const [canvas, ctx] = createCanvas();
	let cells = createCells();

	const animateCells = () => {
		const cellLen: number = cells.length;

		cells.forEach((cell: Cell) => {
			cell.speed += [-0.1, 0.2, 0.3, 0.4][~~(Math.random() * 4)];
			cell.y -= cell.speed;
		});

		cells = cells.filter((cell: Cell) => cell.y >= 0);

		const curLen: number = cells.length;
		const diff: number = cellLen - curLen;
		for (let i = 0; i < diff; i++) {
			cells.push(
				new Cell(Math.random() * window.innerWidth, window.innerHeight - 16)
			);
		}
	};

	const renderCells = () => {
		ctx.globalCompositeOperation = "xor";
		cells.forEach((cell: Cell) => {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = "dodgerblue";
			ctx.globalAlpha = cell.opacity;
			ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		});
	};

	const loop = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		animateCells();
		renderCells();
		requestAnimationFrame(loop);
	};

	renderCells();
	requestAnimationFrame(loop);
};

init();
