class Player {
    constructor(name, id, balance, cardcanvas) {
        if (name === emptyPlayer.name && id === emptyPlayer.id) {
            console.log ('empty player created');
        } else if (!name || !id) {
            console.log('defaulting to auto character')
        } else {
            console.log('created a new player: ' + name)
        }
        
        this.cardcanvas = cardcanvas;
        
        this.name = name || Player.assignGuestName();
        this.id = id || -1;
        this.balance = balance || 0;
        this.gameid = null;

        this.seat = {
            position: undefined,
            x: 0,
            y: 0
        }

        this.holecards = {
            a: null, b: null
        };

        this.drawOnNextUpdate = false;
    };

    render() {
        if (this.drawOnNextUpdate) {
            console.log('drawing player');
            this.drawOnNextUpdate = false;
            this.holecards.a.renderAt(this.seat.x, this.seat.y, this.cardcanvas.getContext('2d'));
            this.holecards.b.renderAt();
        }
    };

    takeSeatAt(table, pos) {
        this.seat.position = pos;

        setTimeout(() => {
            const { px, py } = table.pointOnTable(pos);

            this.seat.x = px;
            this.seat.y = py;
        }, 1500);
    };

    gotHand(a, b) {
        this.holecards.a = new Card(a.value, a.suite);
        this.holecards.b = new Card(b.value, b.suite);

        setTimeout(() => {
            this.drawOnNextUpdate = true;
        });

        console.log(a);
        console.log(b);
        console.log(this.holecards.a.pretty);
        console.log(this.holecards.b.pretty);
    };

    static nullPlayerInstance() {
        return nullInstance;
    };
    
    static isEmpty(p) {
        return p.name === Player.nullPlayerInstance().name && p.id === Player.nullPlayerInstance().id;
    };

    static generateGuestName() {
        return `player ${Math.floor(Math.random() * 100)}`;
    };

    static assignGuestName() {
        let name = Player.generateGuestName();

        while (namedb.has(name)) { // TODO: lolz this is cray stoopid
            name = Player.generateGuestName();
        }

        namedb.add(name);

        return name;
    };
}

const namedb = new Set();

const emptyPlayer = {
    name: '(empty)',
    id: -1,
    balance: 0,
    canvas: undefined
}

const nullInstance = new Player(
    emptyPlayer.name,
    emptyPlayer.id,
    emptyPlayer.balance,
    emptyPlayer.canvas
);