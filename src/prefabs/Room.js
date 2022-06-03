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
        this.prevData = {
            prevSize: 0.4,
            prevPowerUp: null
        }

        //monster spawning
        this.enemies = [];
        this.made = false;
        this.warning = [];
        this.numEnemies = 0;
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
        this.player.body.setSize(100, 100)
        this.spawnPlayer();
        this.physics.add.collider(this.player, this.walls);
        //this.physics.add.collider(this.player, this.doors, this.hitDoor, null, this);
        this.physics.add.collider(this.player, this.doors[0], this.hitDoorUp, null, this);
        this.physics.add.collider(this.player, this.doors[1], this.hitDoorDown, null, this);
        this.physics.add.collider(this.player, this.doors[2], this.hitDoorLeft, null, this);
        this.physics.add.collider(this.player, this.doors[3], this.hitDoorRight, null, this);

        //create wake function
        this.events.on('wake', function() {this.wake()}, this);
        
        //game over
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#87ceeb',
            color: '#000000',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        this.gameOverText = this.add.text(game.config.width/2, game.config.height/2+32, 'Press (SPACE) to return to menu', menuConfig).setOrigin(0.5).setAlpha(0);

        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].type.start) {
            this.boxes = this.add.group();
            let bigBox =    this.physics.add.sprite(350, 200, 'startBox').setScale(2);
            bigBox.tag = 'big';
            bigBox.body.immovable = true;
            let smallBox =  this.physics.add.sprite(950, 200, 'startBox').setScale(2);
            smallBox.flipY = true;
            smallBox.tag = 'small';
            smallBox.body.immovable = true;
            this.boxes.add(bigBox);
            this.boxes.add(smallBox);
            this.physics.add.collider(this.player, this.boxes, this.startCol, null, this);

        }
    }
    wake() {
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].type.normal && this.numEnemies == 0){
            this.made = false;
        }
        this.spawnPlayer();
        this.clearKeys();
    }
    update() {
        //console.log(this.sceneName);
        if(!this.gameOver) {
            this.player.update();
        }
        else {
            this.gameOverText.alpha = 1;
            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.start("menuScene");
            }
        }
        if(gameRooms[this.stageNum].map[this.roomY][this.roomX].type.puzzle){
            gameRooms[this.stageNum].map[this.roomY][this.roomX].exits.scene.puzzleUpdate(this.player, this.doorPos);
            this.normalUpdate();
        }
        else if(gameRooms[this.stageNum].map[this.roomY][this.roomX].type.normal){
            this.normalUpdate();
        }
    }
    spawnPlayer() {
        this.player.size = this.prevData.prevSize;
        this.player.setScale(this.prevData.prevSize);
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
        //this.doors = this.add.group();
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
            gameRooms[this.stageNum].map[this.roomY - 1][this.roomX].exits.scene.prevData.prevSize = this.player.size;
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
            gameRooms[this.stageNum].map[this.roomY + 1][this.roomX].exits.scene.prevData.prevSize = this.player.size;
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
            gameRooms[this.stageNum].map[this.roomY][this.roomX - 1].exits.scene.prevData.prevSize = this.player.size;
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
            gameRooms[this.stageNum].map[this.roomY][this.roomX + 1].exits.scene.prevData.prevSize = this.player.size;
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

    //monster movement
    normalUpdate() {
        if(!this.made) {
            var enemySize = this.player.size;
            this.physics.add.collider(this.enemies, this.walls);
            for(let i = 0; i < Math.floor(Math.random() * 6) + 2; i++) {
                let enemyPick = Math.floor(Math.random() * 3);
                let enemyType;
                switch(enemyPick) {
                    case 0:
                        enemyType = 'slime';
                        break;
                    case 1:
                        enemyType = 'bat';
                        break;
                    case 2:
                        enemyType = 'skull';
                        break;
                }
                if(i == 0) {
                    enemySize = this.player.size - 0.1;
                }
                else {
                    enemySize += 0.1;
                }
                let x = (Math.floor(Math.random() * 800) + 200);
                let y = (Math.floor(Math.random() * 300) + 200);
                let enemy = this.physics.add.sprite(x, y, enemyType).setOrigin(0.5, 0.5).setScale(enemySize);
                enemy.number = i;
                enemy.ogX = x;
                enemy.ogY = y;
                enemy.speedX = 100;
                enemy.speedY = 100;
                enemy.size = enemySize;
                enemy.type = enemyType;
                enemy.setVelocityX(enemy.speedX);
                this.enemies.push(enemy);
                enemy.play(enemy.type + 'Move');
                this.physics.add.collider(this.player, this.enemies[i], this.hitEnemy, null, this);

                this.numEnemies ++;
            }
            this.made = true;
        }

        //Warning symbol
        for(let i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i] == null && this.warning[i] != null) {
                this.warning[i].setScale(0);
            }
            else if(this.enemies[i] == null) {

            }
            else if(this.player.size < this.enemies[i].size && (this.warning[i] == null)) {
                let warning = this.add.image(0, 0, 'warning').setOrigin(0.5, 0.5).setScale(this.enemies[i].size - this.player.size);
                this.warning[i] = warning;
            }
            else if(this.player.size < this.enemies[i].size) {
                this.warning[i].x = this.enemies[i].x;
                this.warning[i].y = this.enemies[i].y - 75 * this.enemies[i].size;
                this.warning[i].setScale(((this.enemies[i].size - this.player.size) * 2) + 0.5);
            }
            else if(this.warning[i] != null){
                this.warning[i].setScale(0);
            }
        }

        //enemy movement
        for(let i = 0; i < this.enemies.length; i++) {
            while(this.enemies[i] == null && i <= this.enemies.length) {
                i++;
            }
            if(i > this.enemies.length) {
                break;
            }
            let enemy = this.enemies[i];
            switch(enemy.type) {
                case 'slime':
                    if(enemy.x > enemy.ogX + 200 || enemy.body.touching.right) {
                        enemy.speedX *= -1;
                        enemy.flipX = !enemy.flipX;
                        enemy.x = enemy.x - 5;
                        enemy.setVelocityX(enemy.speedX);
                    }
                    else if(enemy.x < enemy.ogX - 200 || enemy.body.touching.left) {
                        enemy.speedX *= -1;
                        enemy.x = enemy.x + 5;
                        enemy.flipX = !enemy.flipX;
                        enemy.setVelocityX(enemy.speedX);
                    }
                    break;
                case 'bat':
                    if(enemy.size < this.player.size) {
                        if(!enemy.body.touching.none) {
                            this.physics.accelerateTo(enemy, this.player.x, this.player.y, 5000 , 1)
                        }
                        else {
                            this.physics.accelerateTo(enemy, this.player.x, this.player.y, -60, 1)
                        }
                        
                    }
                    else {
                        this.physics.accelerateTo(enemy, this.player.x, this.player.y, 100, 1)
                    }
                    break;
                case 'skull':
                    if(enemy.x > enemy.ogX + 200 || enemy.body.touching.right) {
                        enemy.speedX *= -1;
                        enemy.x = enemy.x - 5;
                    }
                    else if(enemy.x < enemy.ogX - 200 || enemy.body.touching.left) {
                        enemy.speedX *= -1;
                        enemy.x = enemy.x + 5;
                    }
                    enemy.setVelocityX(enemy.speedX);
                    if(enemy.y > enemy.ogY + 200 || enemy.body.touching.down) {
                        enemy.speedY *= -1;
                        enemy.y = enemy.y - 5;
                    }
                    else if(enemy.y < enemy.ogY - 200 || enemy.body.touching.up) {
                        enemy.speedY *= -1;
                        enemy.y = enemy.y + 5;
                    }
                    enemy.setVelocityY(enemy.speedY);
                    break;
            }
        }
    }
    //collision between enemy and player
    hitEnemy(player, enemy) {
        if(player.size > enemy.size) {
            this.enemies[enemy.number] = null;
            enemy.destroy();
            this.numEnemies --;
            player.size += 0.1;
        }
        else {
            this.player.hit();
            //this.numEnemies --;
            //player.size -= 0.1;
        }
        
    }
    //collision with starting boxes
    startCol(player, box) {
        player.hitBox(box.tag);
    }

}