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
        this.doorPos = [0,0,0,0];

    }
    create() {
        //Keyboard Setup
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //this.spawnDoor();

        //create walls
        this.generateRoom();

        this.add.text(game.config.width/2, game.config.height/2+32, 'room: ' + this.sceneName).setOrigin(0.5);

        this.events.on('wake', function() {this.wake()}, this);
    }
    wake() {
        this.spawnPlayer();
        this.clearKeys();
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
                this.scene.sleep(this.sceneName);
                this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.sceneName, "RIGHT");
                
            }
            else {
                console.log("no room right");
            } 
        }
        else if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
                this.scene.sleep(this.sceneName);
                this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.sceneName, "LEFT");
                
            }
            else {
                console.log("no room left");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
                this.scene.sleep(this.sceneName);
                this.scene.run(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.sceneName, "UP");
            }
            else {
                console.log("no room up");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
                this.scene.sleep(this.sceneName);   
                this.scene.run(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.sceneName, "DOWN");
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
    generateRoom() {
        //specify door spawns
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
            if(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.doorPos[1] != 0) {
                this.doorPos[0] = gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.doorPos[1]; 
            }
            else {
                this.doorPos[0] = Math.floor(4 + (Math.random() * 15)) * 45;
            }
            
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
            if(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.doorPos[0] != 0) {
                this.doorPos[1] = gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.doorPos[0]; 
            }
            else {
                this.doorPos[1] = Math.floor(4 + (Math.random() * 15)) * 45;
            }
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.doorPos[3] != 0) {
                this.doorPos[2] = gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.doorPos[3];
            }
            else {
                this.doorPos[2] = Math.floor(4 + (Math.random() * 7)) * 45;
            }
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.doorPos[2] != 0) {
                this.doorPos[3] = gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.doorPos[2]; 
            }
            else {
                this.doorPos[3] = Math.floor(4 + (Math.random() * 7)) * 45;
            }
        }

        //generate walls
        this.walls = this.add.group();
        for(let i = 0; i < game.config.width; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up && i == this.doorPos[0]) {
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(i, 0, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.width; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down && i == this.doorPos[1]) {
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(i, game.config.height - 45, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left && i == this.doorPos[2]) {
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(0, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right && i == this.doorPos[3]) {
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(game.config.width - 45, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            this.walls.add(wallTile);
        }
    }

    clearKeys() {
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
}