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
        this.doors = [null, null, null, null];

        //some fields
        this.gameOver = false;

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

        this.player = new Player(this, 0,0, 'player').setOrigin(0.5, 0.5);
        this.spawnPlayer(); 
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.player, this.doors, this.hitDoor, null, this);

        //create wake function
        this.events.on('wake', function() {this.wake()}, this);
    }
    wake() {
        this.spawnPlayer();
        this.clearKeys();
    }
    update() {
        if(!this.gameOver) {
            this.player.update();
        }
    }
    spawnPlayer() {
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
        this.doors = this.add.group();
        for(let i = 0; i < game.config.width; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up && i == this.doorPos[0]) {
                let door = this.physics.add.sprite(i, 0, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors.add(door);
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(i, 0, 'wallTile').setOrigin(0, 0).setScale(0.2);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.width; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down && i == this.doorPos[1]) {
                let door = this.physics.add.sprite(i, game.config.height - 45, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors.add(door);
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(i, game.config.height - 45, 'wallTile').setOrigin(0, 0).setScale(0.2);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left && i == this.doorPos[2]) {
                let door = this.physics.add.sprite(0, i, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors.add(door);
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(0, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
        for(let i = 0; i < game.config.height; i+= 45) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right && i == this.doorPos[3]) {
                let door = this.physics.add.sprite(game.config.width - 45, i, 'door').setOrigin(0, 0);
                door.body.immovable = true;
                this.doors.add(door);
                i+= 45;
            }  
            let wallTile = this.physics.add.sprite(game.config.width - 45, i, 'wallTile').setOrigin(0, 0).setScale(0.2);
            wallTile.body.immovable = true;
            this.walls.add(wallTile);
        }
    }
    //Collision Functions
    hitDoor() {
        console.log("touch");
        if(this.player.body.touching.right){
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.right) {
                this.scene.sleep(this.sceneName);
                gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.cameFrom = "RIGHT";
                this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.sceneName, "RIGHT");
                
            }
            else {
                console.log("no room right");
            } 
        }
        else if(this.player.body.touching.left) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.left) {
                this.scene.sleep(this.sceneName);
                gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.cameFrom = "LEFT";
                this.scene.run(gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.sceneName, "LEFT");
                
            }
            else {
                console.log("no room left");
            } 

        }
        else if(this.player.body.touching.up) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.up) {
                this.scene.sleep(this.sceneName);
                gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.cameFrom = "UP";
                this.scene.run(gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.sceneName);
            }
            else {
                console.log("no room up");
            } 

        }
        else if(this.player.body.touching.down) {
            if(gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.down) {
                this.scene.sleep(this.sceneName);
                gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.cameFrom = "DOWN";
                this.scene.run(gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.sceneName);
            }
            else {
                console.log("no room down");
            } 
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