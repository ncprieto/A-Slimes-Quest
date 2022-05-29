class Room extends Phaser.Scene{
    constructor(name){
        super(name);
        this.sceneName = name;
        this.cameFrom = "START";

        //determine room x and y
        let roomNum = name.substring(name.indexOf('_') + 1);
        this.roomY = parseInt(roomNum.substring(0, 1));
        this.roomX = parseInt(roomNum.substring(1));

        //stage num
        this.stageNum = parseInt(name.substring(5, name.indexOf('_'))) - 1;
        this.doorPos = [0,0,0,0];
        this.doorSize = [0,0,0,0];
        this.doors = [0,0,0,0];

        //some fields
        this.gameOver = false;

        this.prevSize = 0.4;
    }
    create() {
        //Keyboard Setup
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        //this.spawnDoor();

        //create walls
        this.generateRoom();

        this.add.text(game.config.width/2, game.config.height/2+32, 'room: ' + this.sceneName).setOrigin(0.5);

        this.player = new Player(this, 0,0, 'player').setOrigin(0.5, 0.5);
        this.spawnPlayer();
        this.physics.add.collider(this.player, this.walls);
        //this.physics.add.collider(this.player, this.doors, this.hitDoor, null, this);
        this.physics.add.collider(this.player, this.doors[0], this.hitDoorUp, null, this);
        this.physics.add.collider(this.player, this.doors[1], this.hitDoorDown, null, this);
        this.physics.add.collider(this.player, this.doors[2], this.hitDoorLeft, null, this);
        this.physics.add.collider(this.player, this.doors[3], this.hitDoorRight, null, this);

        //create wake function
        this.events.on('wake', function() {this.wake()}, this);
    }
    wake() {
        this.spawnPlayer();
        this.clearKeys();
    }
    update() {
        console.log(this.sceneName);
        if(!this.gameOver) {
            this.player.update();
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].type.puzzle){
            gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.scene.puzzleUpdate(this.player, this.doorPos);
        }
    }
    spawnPlayer() {
        this.player.size = this.prevSize;
        this.player.setScale(this.prevSize);
        switch(this.cameFrom){
            case "UP":
                this.player.x = this.doorPos[1] + 22.5;
                this.player.y = game.config.height - 72.5;
                return;
            case "DOWN":
                this.player.x = this.doorPos[0] + 22.5;
                this.player.y = 72.5;
                return;

            case "LEFT":
                this.player.x = game.config.width - 72.5;
                this.player.y = this.doorPos[3] + 22.5;
                return

            case "RIGHT":
                this.player.x = 72.5;
                this.player.y = this.doorPos[2] + 22.5;
                return;
            case "START":
                this.player.x = game.config.width/2;
                this.player.y = game.config.width/2;
        }
    }
    generateRoom() {
        this.wallSize = 48;
        this.wallScale = 0.75;
        //this.background = this.add.image(0,0, 'background').setOrigin(0,0);

        //specify door spawns
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
            if(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.doorPos[1] != 0) {
                this.doorPos[0] = gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.doorPos[1];
                this.doorSize[0] = gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.doorSize[1];
            }
            else {
                this.doorPos[0] = Math.floor(4 + (Math.random() * 15)) * this.wallSize;
                this.doorSize[0] = Math.floor(2 + (Math.random() * 8)) * 3;
            }
            
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
            if(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.doorPos[0] != 0) {
                this.doorPos[1] = gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.doorPos[0]; 
                this.doorSize[1] = gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.doorSize[0];
            }
            else {
                this.doorPos[1] = Math.floor(4 + (Math.random() * 15)) * this.wallSize;
                this.doorSize[1] = Math.floor(2 + (Math.random() * 8)) * 3;
            }
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.doorPos[3] != 0) {
                this.doorPos[2] = gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.doorPos[3];
                this.doorSize[2] = gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.doorSize[3];
            }
            else {
                this.doorPos[2] = Math.floor(4 + (Math.random() * 7)) * this.wallSize;
                this.doorSize[2] = Math.floor(2 + (Math.random() * 8)) * 3;
            }
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.doorPos[2] != 0) {
                this.doorPos[3] = gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.doorPos[2];
                this.doorSize[3] = gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.doorSize[2];  
            }
            else {
                this.doorPos[3] = Math.floor(4 + (Math.random() * 7)) * this.wallSize;
                this.doorSize[3] = Math.floor(2 + (Math.random() * 8)) * 3;
            }
        }

        //generate walls
        this.walls = this.add.group();
        this.doors = this.add.group();
        for(let i = 0; i < game.config.width; i+= this.wallSize) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up && i == this.doorPos[0]) {
                let doorSide1 = this.physics.add.sprite(i + this.wallSize/2 + this.doorSize[0], 0, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
                let doorSide2 = this.physics.add.sprite(i + this.wallSize/2 - this.doorSize[0], 0, 'wallTile').setOrigin(1, 0).setScale(this.wallScale);
                doorSide1.body.immovable = true;
                doorSide2.body.immovable = true;
                this.walls.add(doorSide1);
                this.walls.add(doorSide2);
                let door = this.physics.add.sprite(i, -24, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                //this.doors.add(door);
                this.doors[0] = door;
                i += this.wallSize;
            }  
            let wallTile = this.physics.add.sprite(i, 0, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.width; i+= this.wallSize) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down && i == this.doorPos[1]) {
                let doorSide1 = this.physics.add.sprite(i + this.wallSize/2 + this.doorSize[1], game.config.height - this.wallSize, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
                let doorSide2 = this.physics.add.sprite(i + this.wallSize/2 - this.doorSize[1], game.config.height - this.wallSize, 'wallTile').setOrigin(1, 0).setScale(this.wallScale);
                doorSide1.body.immovable = true;
                doorSide2.body.immovable = true;
                this.walls.add(doorSide1);
                this.walls.add(doorSide2);
                let door = this.physics.add.sprite(i, game.config.height - this.wallSize/2, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors[1] = door;
                i+= this.wallSize;
            }  
            let wallTile = this.physics.add.sprite(i, game.config.height - this.wallSize, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= this.wallSize) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left && i == this.doorPos[2]) {
                let doorSide1 = this.physics.add.sprite(0, i + this.wallSize/2 + this.doorSize[2], 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
                let doorSide2 = this.physics.add.sprite(0, i + this.wallSize/2 - this.doorSize[2], 'wallTile').setOrigin(0, 1).setScale(this.wallScale);
                doorSide1.body.immovable = true;
                doorSide2.body.immovable = true;
                this.walls.add(doorSide1);
                this.walls.add(doorSide2);
                let door = this.physics.add.sprite(-24, i, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors[2] = door;
                i+= this.wallSize;
            }  
            let wallTile = this.physics.add.sprite(0, i, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= this.wallSize) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right && i == this.doorPos[3]) {
                let doorSide1 = this.physics.add.sprite(game.config.width - this.wallSize, i + this.wallSize/2 + this.doorSize[3], 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
                let doorSide2 = this.physics.add.sprite(game.config.width - this.wallSize, i + this.wallSize/2 - this.doorSize[3], 'wallTile').setOrigin(0, 1).setScale(this.wallScale);
                doorSide1.body.immovable = true;
                doorSide2.body.immovable = true;
                this.walls.add(doorSide1);
                this.walls.add(doorSide2);
                let door = this.physics.add.sprite(game.config.width - this.wallSize/2, i, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors[3] = door;
                i+= this.wallSize;
            }  
            let wallTile = this.physics.add.sprite(game.config.width - this.wallSize, i, 'wallTile').setOrigin(0, 0).setScale(this.wallScale);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
    }
    hitDoorUp() {
        this.sound.play('move');
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
            this.scene.sleep(this.sceneName);
            gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.cameFrom = "UP";
            gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.prevSize = this.player.size;
            this.scene.run(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.sceneName, "UP");
        }
        else {
            console.log("no room up");
        }
    }
    hitDoorDown() {
        this.sound.play('move');
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
            this.scene.sleep(this.sceneName);
            gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.cameFrom = "DOWN";
            gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.prevSize = this.player.size;
            this.scene.run(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.sceneName, "DOWN");
        }
        else {
            console.log("no room down");
        } 
    }
    hitDoorLeft() {
        this.sound.play('move');
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
            this.scene.sleep(this.sceneName);
            gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.cameFrom = "LEFT";
            gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.prevSize = this.player.size;
            this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.sceneName, "LEFT");
            
        }
        else {
            console.log("no room left");
        } 
    }
    hitDoorRight() {
        this.sound.play('move');
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
            this.scene.sleep(this.sceneName);
            gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.cameFrom = "RIGHT";
            gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.prevSize = this.player.size;
            this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.sceneName, "RIGHT");
            
        }
        else {
            console.log("no room right");
        } 
    }  
        

    //Scene Clean Up
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