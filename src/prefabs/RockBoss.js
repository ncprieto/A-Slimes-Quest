class RockBoss extends Room{
    constructor(name, doorStr, backgrounStr, bossCords){
        super(name);
        this.roomMade = false;
        this.doorStr = doorStr;
        this.backgroundStr = backgrounStr;
        this.bossCords = bossCords;
    }
    rockBossUpdate(player, doorPosArr, background){
        if(!this.roomMade){
            this.player = player;
            background.setTexture(this.backgroundStr);
            this.closeDoor(doorPosArr);
            this.makeBossFight();
            this.roomMade = true;
        }
        if(this.rock1.alpha < 1 && this.rock2.alpha < 1){
            this.rock1.alpha += 0.005;
            this.rock2.alpha += 0.005;
        }
        if(!this.rock1Obj.dead){
            this.runrockBoss(this.rock1, this.rock1Obj);
        }
        if(!this.rock2Obj.dead){
            this.runrockBoss(this.rock2, this.rock2Obj);
        }
        if(this.piece1.y == this.piece1Obj.target[1] && this.piece1.x == this.piece1Obj.target[0] && !this.piece1TargetReached){
            this.piece1TargetReached = true;
            this.player.size += 0.025;
            this.updateRockBossObj();
        }
        if(this.piece2.y == this.piece2Obj.target[1] && this.piece2.x == this.piece2Obj.target[0] && !this.piece2TargetReached){
            this.piece2TargetReached = true;
            this.player.size += 0.025;
            this.updateRockBossObj();
        }
        if(this.piece3.y == this.piece3Obj.target[1] && this.piece3.x == this.piece3Obj.target[0] && !this.piece3TargetReached){
            this.piece3TargetReached = true;
            this.player.size += 0.025;
            this.updateRockBossObj();
        }
        if((this.piece4.y == this.piece4Obj.target[1] && this.piece4.x == this.piece4Obj.target[0] && !this.piece4TargetReached)
         && (this.piece1TargetReached && this.piece2TargetReached && this.piece3TargetReached)){
            this.rock1Obj.dead = true;
            this.rock2Obj.dead = true;
            this.bossComplete.setAlpha(1);
        }
        if(this.rock1Obj.dead && this.rock2Obj.dead){
            this.rock1.destroy(true);
            this.rock2.destroy(true);
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.rock1Obj.dead && this.rock2Obj.dead){
            this.scene.sleep(gameRooms[1].map[this.bossCords[0]][this.bossCords[1]].exits.scene.sceneName);
            this.scene.start(gameRooms[1].map[2][2].exits.scene.sceneName);
        }
    }
    makeBossFight(){
        // rock1 ROCK BOSS
        // this rock is fast and has a fast slam speed but has a shallow slam depth
        this.rock1 = this.physics.add.sprite(540, 310, 'rockBoss').setScale(0.8).setSize(175, 175).setOrigin(0.5, 0.5).setAlpha(0);
        this.rock1Obj = {                       // this structure holds data for the various states the boss is in
            goingUp: false,
            tracking: false,
            slamming: false,
            slamInit: false,
            slammedY: 310,                      // target y value the boss reaches when 'slamming' down
            slamSpeed: 5,                       // speed at which boss slams down in pixels
            recallSpeed: 0.5,                   // how fast the boss gets up after slamming in pixels
            slamDepth: 90,                      // how deep the boss slams down also in pixels
            speed: 150,                         // speed at which the boss moves
            dead: false
        }
        this.rock1.play('rockBossAnimation');
        this.physics.add.collider(this.player, this.rock1, () => this.player.hit(), null, this);
        this.rock1.body.immovable = true;
        this.rock1GoUpTimer = this.time.addEvent({delay: 1000, callback: () => this.rock1Obj.goingUp = true, callbackScope: this, loop: true});
        this.rock1SlamTimer = this.time.addEvent({delay: 2250, callback: () => this.rock1Obj.slamming = true, callbackScope: this, loop: true});
        // SUB 1 ROCK BOSS
        // this rock moves prett slow but has a huge slam depth but also slams really slow
        this.rock2 = this.physics.add.sprite(720, 310, 'rockBoss').setScale(0.8).setSize(175, 175).setOrigin(0.5, 0.5).setAlpha(0);
        this.rock2Obj = {
            goingUp: false,
            tracking: false,
            slamming: false,
            slamInit: false,
            slammedY: 310,
            slamSpeed: 2,
            recallSpeed: 1.3,
            slamDepth: 170,
            speed: 100,
            dead: false
        }
        this.rock2.play('rockBossAnimation');
        this.physics.add.collider(this.player, this.rock2, () => this.player.hit(), null, this);
        this.rock2.body.immovable = true;
        this.rock2GoUpTimer = this.time.addEvent({delay: 1000, callback: () => this.rock2Obj.goingUp = true, callbackScope: this, loop: true});
        this.rock2SlamTimer = this.time.addEvent({delay: 3000, callback: () => this.rock2Obj.slamming = true, callbackScope: this, loop: true});
        // PUZZLE PIECE 1
        this.piece1Obj = {
            path: [373, 176, 560],
            target: [560, 373]
        }
        this.piece1 = this.physics.add.sprite(1500, 1500, 'puzzle_piece_stage1').setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece1TargetReached = false;
        this.piece1Timer = this.time.addEvent({delay: 10000,                   // timer the triggers puzzle piece spawning
            callback: () => {if(!this.piece1Spawned){                          // pieces 1 and 2 will spawn at roughly the same time
            this.piece1.x = this.piece1Obj.path[1];
            this.piece1.y = this.piece1Obj.path[0];
            this.piece1Spawned = true;}}, callbackScope: this, loop: true});
        this.physics.add.collider(this.player, this.piece1, this.hitPiece1, null, this);
        // PUZZLE PIECE 2
        this.piece2Obj = {
            path: [943, 180, 568],
            target: [943, 568]
        }
        this.piece2 = this.physics.add.sprite(1500, 1500, 'puzzle_piece_stage1').setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2TargetReached = false;
        this.piece2Timer = this.time.addEvent({delay: 15000,
            callback: () => {if(!this.piece2Spawned){
            this.piece2.x = this.piece2Obj.path[0];
            this.piece2.y = this.piece2Obj.path[1];
            this.piece2Spawned = true;}}, callbackScope: this, loop: true});
        this.physics.add.collider(this.player, this.piece2, this.hitPiece2, null, this);
        // PUZZLE PIECE 3
        this.piece3Obj = {
            path: [368, 180, 565],
            target: [368, 180]
        }
        this.piece3 = this.physics.add.sprite(1500, 1500, 'puzzle_piece_stage1').setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3TargetReached = false;
        this.piece3Timer = this.time.addEvent({delay: 9000,
            callback: () => {if(!this.piece3Spawned && this.piece1TargetReached && this.piece2TargetReached){   // pieces 3 and 4 will not spawn until pieces 1 and 2 have reached
            this.piece3.x = this.piece3Obj.path[0];                                                             // their desired position
            this.piece3.y = this.piece3Obj.path[2];
            this.piece3Spawned = true;}}, callbackScope: this, loop: true});
        this.physics.add.collider(this.player, this.piece3, this.hitPiece3, null, this);
        // PUZZLE PIECE 4
        this.piece4Obj = {
            path: [470, 176, 943],
            target: [176, 470]
        }
        this.piece4 = this.physics.add.sprite(1500, 1500, 'puzzle_piece_stage1').setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece4TargetReached = false;
        this.piece4Timer = this.time.addEvent({delay: 13000,
            callback: () => {if(!this.piece4Spawned && this.piece1TargetReached && this.piece2TargetReached){
            this.piece4.x = this.piece4Obj.path[2];
            this.piece4.y = this.piece4Obj.path[0];
            this.piece4Spawned = true;}}, callbackScope: this, loop: true});
        this.physics.add.collider(this.player, this.piece4, this.hitPiece4, null, this);
        // boss complete screen
        this.bossComplete = this.add.image(0,0,'rockBossComplete').setOrigin(0,0).setAlpha(0);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    // state machine that controls movement of the boss sprites
    runrockBoss(rockBoss, rockBossObj){
        if(rockBossObj.goingUp && !rockBossObj.tracking && !rockBossObj.slamming){ // 'updward' movement of the boss 
            rockBoss.y -= rockBossObj.recallSpeed;
            if(rockBoss.y <= rockBossObj.slammedY - 75){
                rockBossObj.tracking = true;
                rockBossObj.goingUp = false;
            }
        }
        if(rockBossObj.tracking && !rockBossObj.slamming){                        // consistent tracking of the player sprite
            this.physics.moveTo(rockBoss, this.player.x, this.player.y - 180, rockBossObj.speed); // boss sprite tries to position itself 200 pixels above the player
        }
        if(rockBossObj.slamming){                                                 // boss sprites move 'downward' at a specified speed found in the corresponding obj
            if(!rockBossObj.slamInit){
                rockBossObj.tracking = false;
                rockBoss.setVelocityX(0);
                rockBoss.setVelocityY(0);
                rockBossObj.slammedY = rockBoss.y + rockBossObj.slamDepth;
                rockBossObj.slamInit = true;
            }
            rockBoss.y += rockBossObj.slamSpeed;
            if(rockBoss.y >= rockBossObj.slammedY){
                rockBossObj.slamming = false;
                rockBossObj.slamInit = false;
            }
        }
    }
    // make both rock incrementally harder after successfully completing a piece of the puzzle
    updateRockBossObj(){
        this.rock1Obj.slamSpeed += 1;
        this.rock1Obj.slamDepth += 15;
        this.rock1Obj.speed += 25;
        this.rock1Obj.recallSpeed += 0.2;
        this.rock2Obj.slamSpeed += 3;
        this.rock2Obj.recallSpeed += 0.5;
        this.rock2Obj.speed += 10;
    }
    hitPiece1(){
        this.pieceMovesHorizontal(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
    }
    hitPiece2(){
        this.pieceMovesVertical(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
    }
    hitPiece3(){
        this.pieceMovesVertical(this.piece3, this.piece3Obj.path[0], this.piece3Obj.path[1], this.piece3Obj.path[2]);
    }
    hitPiece4(){
        this.pieceMovesHorizontal(this.piece4, this.piece4Obj.path[0], this.piece4Obj.path[1], this.piece4Obj.path[2]);
    }
    // pieceMovesVertical() enforces that a piece sprite moves on a verical plan
    pieceMovesVertical(piece, constant, bound1, bound2){
        piece.setVelocityX(0);
        piece.setVelocityY(0);
        if(piece.y <= bound1){
            piece.y = bound1;
        }
        if(piece.y >= bound2){
            piece.y = bound2;
        }
        piece.x = constant;
    }
    // pieceMovesHorizontal() enforces that a piece sprite moves on horizontal plane
    pieceMovesHorizontal(piece, constant, bound1, bound2){
        piece.setVelocityX(0);
        piece.setVelocityY(0);
        if(piece.x <= bound1){
            piece.x = bound1;
        }
        if(piece.x >= bound2){
            piece.x = bound2;
        }
        piece.y = constant;
    }
    closeDoor(doorPosArr){
        for(let i in doorPosArr){
            if(doorPosArr[i] != 0){
                if(i == 0){
                    this.lockedDoor = this.physics.add.sprite(doorPosArr[0], 0, this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
                }
                else if(i == 1){
                    this.lockedDoor = this.physics.add.sprite(doorPosArr[1], game.config.height - this.wallSize, this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
                }
                else if(i == 2){
                    this.lockedDoor = this.physics.add.sprite(0, doorPosArr[2], this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
                }
                else if(i == 3){
                    this.lockedDoor = this.physics.add.sprite(game.config.width - this.wallSize, doorPosArr[3], this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
                }
                this.lockedDoor.body.immovable = true;
            }
        }
        this.physics.add.collider(this.player, this.lockedDoor);
    }
}