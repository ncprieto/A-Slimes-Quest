class Room extends Phaser.Scene{
    constructor(name){
        super(name);
        this.sceneName = name;

        //determine room x and y
        let roomNum = name.substring(name.indexOf('_') + 1);
        this.roomY = parseInt(roomNum.substring(0, 1));
        this.roomX = parseInt(roomNum.substring(1));

        //stage num
        this.stageNum = parseInt(name.substring(5, name.indexOf('_'))) - 1;
        this.doorPos = [(0,0), (0,0), (0,0), (0,0)]

    }
    create() {
        //Keyboard Setup
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spawnDoor();

        //create walls
        this.walls = this.add.group();
        for(let i = 0; i < game.config.width; i+= 45) {
            let wallTile = this.physics.add.sprite(i, 70, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.width; i+= 45) {
            let wallTile = this.physics.add.sprite(i, game.config.height - 45, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            let wallTile = this.physics.add.sprite(0, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            let wallTile = this.physics.add.sprite(game.config.width - 45, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }

        this.add.text(game.config.width/2, game.config.height/2+32, 'room: ' + this.sceneName).setOrigin(0.5);
    }
    wake() {
        this.spawnPlayer();
    }
    update() {
        console.log(this.sceneName);
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room right");
            } 
            
        }
        else if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room left");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room up");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room down");
            } 

        }
    }
    spawnPlayer() {
        switch(this.scene.settings.data[0]){
            case "UP":
                return this.doorPos[0];

            case "DOWN":
                return this.doorPos[1];

            case "LEFT":
                return this.doorPos[2];

            case "RIGHT":
                return this.doorPos[3];
        }
    }
    spawnDoor() {

    }
}