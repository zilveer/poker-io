const toradian = theta => theta * (Math.PI / 180);

const thetaUpper = toradian(25);
const thetaLower = toradian(325);

const scalingvalue = 0.65;

class TableObject {
    constructor(maxseats, parentcanvas, textcanvas) {
        this.maxseats = maxseats;

        this.parentcanvas = parentcanvas;
        this.textcanvas = textcanvas;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'canvas-table');

        this.seats = new Map();

        this.postion = {
            x: 0, y: 0
        };

        this.canvasorigin = {
            x: 0, y: 0
        }

        this.dimensions = {
            w: 0, h: 0, r: 0, off: 0
        };

        this.labels = {
            center: new Label('serif', 24, 'black')
        };

        this.drawOnNextUpdate = false;
    };

    render() {
        if (this.drawOnNextUpdate) {
            console.log('drawing table');

            this.drawOnNextUpdate = false;

            this.resize();
            this.draw();

            this.labels.center.draw('text here', this.textcanvas, this.parentcanvas.width / 2, this.parentcanvas.height / 2);

            for (const [si, so] of this.seats) {
                if (!so.seat.vacant) {
                    continue;
                }

                const p = this.pointOnTable(si);

                so.labels.playername.draw(so.seat.playername, this.textcanvas, p.x, p.y)
            }
        }
    };

    resize() {
        this.dimensions.w = Math.floor(this.parentcanvas.width * scalingvalue);
        this.dimensions.h = Math.floor(this.parentcanvas.height * scalingvalue);

        this.canvasorigin.x = Math.floor(this.dimensions.w * 0.5);
        this.canvasorigin.y = Math.floor(this.dimensions.h * 0.5);

        this.postion.x = Math.floor(this.parentcanvas.width / 2 - this.canvasorigin.x);
        this.postion.y = Math.floor(this.parentcanvas.height / 2 - this.canvasorigin.y);

        this.dimensions.r = Math.floor(this.dimensions.h / 4);
        this.dimensions.off = Math.floor(this.dimensions.w * 0.15);
    };

    draw() {
        this.canvas.width = this.dimensions.w;
        this.canvas.height = this.dimensions.h;

        const ctx = this.canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(this.canvasorigin.x - this.dimensions.off, this.canvasorigin.y, this.dimensions.r, Math.PI * 0.5, Math.PI * 0.5 + Math.PI);
        ctx.arc(this.canvasorigin.x + this.dimensions.off, this.canvasorigin.y, this.dimensions.r, Math.PI * 0.5 + Math.PI, Math.PI * 0.5);
        ctx.fillStyle = 'green';
        ctx.fill();

        this.parentcanvas.getContext('2d').drawImage(this.canvas, this.postion.x, this.postion.y);
    };

    emptySeat(seatindex) {
        if (this.seats.size > this.maxseats) {
            return false;
        }

        this.seats.set(seatindex, {
            seat: new Seat(seatindex, 32, 'black'),
            labels: {
                playername: new Label('serif', 18, ' white'),
                playerbalance: new Label('serif', 18, ' white')
            }
        });

        return true;
    };

    pointOnTable(position) {
        const ox = this.parentcanvas.width / 2;
        const oy = this.parentcanvas.height / 2;
        const r = this.dimensions.r;
        const off = this.dimensions.off;

        const offsetLeft = ox - off;
        const offsetRight = ox + off;

        let x = -1;
        let y = -1;

        switch (position) {
            case -2: // center
                x = ox;
                y = oy;
                break;
            case -1: // center upper
                x = ox;
                y = oy - r;
                break;
            case 0: // right upper
                x = offsetRight;
                y = oy - r;
                break;
            case 1: // right theta upper
                x = offsetRight + r * Math.cos(thetaUpper);
                y = oy - r * Math.sin(thetaUpper);
                break;
            case 2: // right theta lower
                x = offsetRight + r * Math.cos(thetaLower);
                y = oy - r * Math.sin(thetaLower);
                break;
            case 3: // right lower
                x = offsetRight;
                y = oy + r;
                break;
            case 4: // center lower
                x = ox;
                y = oy + r;
                break;
            case 5: // left lower
                x = offsetLeft;
                y = oy + r;
                break;
            case 6: // left theta lower
                x = offsetLeft - r * Math.cos(thetaLower);
                y = oy - r * Math.sin(thetaLower);
                break;
            case 7: // left theta upper
                x = offsetLeft - r * Math.cos(thetaUpper);
                y = oy - r * Math.sin(thetaUpper);
                break;
            case 8: // left upper
                x = offsetLeft;
                y = oy - r;
                break;
            default:
                break;
        }

        return {
            x: x, y: y
        };
    };
}