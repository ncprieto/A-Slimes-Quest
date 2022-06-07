class Puzzle4 extends Room{
    constructor(name, roomY, roomX, prizeX, prizeY, backgroundStr, pieceStr, doorStr){
        super(name);
        this.wallScale = 0.75;
        this.roomY = roomY;
        this.roomX = roomX;
        this.prizeX = prizeX;
        this.prizeY = prizeY;
        this.puzzleMade = false;
        this.backgroundStr = backgroundStr;
        this.pieceStr = pieceStr;
        this.doorStr = doorStr;
    }
    puzzleUpdate(player, doorPosArr, background){
        this.player =  player;
        if(this.backgroundStr == 'puzzle2_floor_stage1' && !this.puzzleMade){
            background.setTexture(this.backgroundStr);
            console.log("MAKING PUZZLE 4 STAGE 1")
            this.makePuzzle4Stage1();
        }
        else if(this.backgroundStr == 'puzzle2_floor_stage2' && !this.puzzleMade){
            console.log("MAKING PUZZLE 4 STAGE 2");
            background.setTexture(this.backgroundStr);
            this.makePuzzle4Stage2();           
        }
        if(!this.puzzleMade){
            this.makeLockedDoor(doorPosArr);
            this.physics.add.collider(this.player, this.piece1, this.hitPiece1, null, this);
            this.physics.add.collider(this.player, this.piece2, this.hitPiece2, null, this);
            this.physics.add.collider(this.player, this.piece3, this.hitPiece3, null, this);
            this.physics.add.collider(this.player, this.piece4, this.hitPiece4, null, this);
            this.physics.add.collider(this.player, this.lockedDoor);
            this.puzzleMade = true;
        }
        if(this.piece1.y == this.piece1Obj.target[1] && this.piece1.x == this.piece1Obj.target[0]
        && this.piece2.y == this.piece2Obj.target[1] && this.piece2.x == this.piece2Obj.target[0]
        && this.piece3.y == this.piece3Obj.target[1] && this.piece3.x == this.piece3Obj.target[0]
        && this.piece4.y == this.piece4Obj.target[1] && this.piece4.x == this.piece4Obj.target[0]){
            this.lockedDoor.destroy(true);
            this.sound.play('puzzleSolve');
        }
    }
    makePuzzle4Stage1(){
        console.log("MAKING PUZZLE 4 STAGE 1");
        this.piece1Obj = {
            path: [81, 82, 469, 469, 81, 1041],
            target: [1041, 469],
            inVert: true,
            inHoriz: false
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[0], this.piece1Obj.path[1], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [1136, 179, 567, 179, 943, 1136],
            target: [943, 179],
            inVert: true,
            inHoriz: false
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[0], this.piece2Obj.path[2], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [275, 273, 657, 273, 275, 372],
            target: [273, 372],
            inVert: false,
            inHoriz: true
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[2], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece4Obj = {
            path: [176, 369, 752, 752, 176, 273],
            target: [752, 273],
            inVert: false,
            inHoriz: true
        }
        this.piece4 = this.physics.add.sprite(this.piece4Obj.path[1], this.piece4Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
    }
    makePuzzle4Stage2(){
        console.log("MAKING PUZZLE 4 STAGE 2");
        this.piece1Obj = {
            path: [81, 82, 469, 469, 81, 178],
            target: [178, 469],
            inVert: true,
            inHoriz: false
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[0], this.piece1Obj.path[1], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [1136, 179, 567, 179, 1041, 1136],
            target: [1041, 179],
            inVert: true,
            inHoriz: false
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[0], this.piece2Obj.path[2], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [179, 466, 657, 466, 179, 277],
            target: [466, 277],
            inVert: false,
            inHoriz: true
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[2], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece4Obj = {
            path: [374, 369, 848, 848, 374, 469],
            target: [848, 469],
            inVert: false,
            inHoriz: true
        }
        this.piece4 = this.physics.add.sprite(this.piece4Obj.path[1], this.piece4Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
    }
    makeLockedDoor(doorPosArr){
        // this branch of conditionals adds an immovable door in front of
        // the actual door the player can moves through
        if(this.roomY > this.prizeY){
            this.lockedDoor = this.physics.add.sprite(doorPosArr[0], 0, this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
        }
        else if(this.roomY < this.prizeY){
            this.lockedDoor = this.physics.add.sprite(doorPosArr[1], game.config.height - this.wallSize, this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
        }
        else if(this.roomX > this.prizeX){
            this.lockedDoor = this.physics.add.sprite(0, doorPosArr[2], this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
        }
        else if(this.roomX < this.prizeX){
            this.lockedDoor = this.physics.add.sprite(game.config.width - this.wallSize, doorPosArr[3], this.doorStr).setOrigin(0, 0).setScale(this.wallScale);
        }
        this.lockedDoor.body.immovable = true;
    }
    hitPiece1(){
        console.log("TOUCHING PIECE ONE");
        if(this.piece1.x == this.piece1Obj.path[0] && this.piece1.y == this.piece1Obj.path[3]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece1, this.piece1Obj.path[3], this.piece1Obj.path[4], this.piece1Obj.path[5]);
                this.piece1Obj.inHoriz = true;
                this.piece1Obj.inVert = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
                this.piece1Obj.inHoriz = false;
                this.piece1Obj.inVert = true;
            }
        }
        else if(this.piece1Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece1, this.piece1Obj.path[3], this.piece1Obj.path[4], this.piece1Obj.path[5]);
            this.piece1Obj.inVert = false;
        }
        else if(this.piece1Obj.inVert){
            this.pieceMovesVertical(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
            this.piece1Obj.inHoriz = false;
        }
    }
    hitPiece2(){
        console.log("TOUCHING PIECE TWO");
        if(this.piece2.x == this.piece2Obj.path[0] && this.piece2.y == this.piece2Obj.path[3]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[3], this.piece2Obj.path[4], this.piece2Obj.path[5]);
                this.piece2Obj.inHoriz = true;
                this.piece2Obj.inVert = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
                this.piece2Obj.inHoriz = false;
                this.piece2Obj.inVert = true;
            }
        }
        else if(this.piece2Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[3], this.piece2Obj.path[4], this.piece2Obj.path[5]);
            this.piece2Obj.inVert = false;
        }
        else if(this.piece2Obj.inVert){
            this.pieceMovesVertical(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
            this.piece2Obj.inHoriz = false;
        }
    }
    hitPiece3(){
        console.log("TOUCHING PIECE THREE");
        if(this.piece3.x == this.piece3Obj.path[1] && this.piece3.y == this.piece3Obj.path[0]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece3, this.piece3Obj.path[0], this.piece3Obj.path[1], this.piece3Obj.path[2]);
                this.piece3Obj.inHoriz = true;
                this.piece3Obj.inVert = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece3, this.piece3Obj.path[3], this.piece3Obj.path[4], this.piece3Obj.path[5]);
                this.piece3Obj.inHoriz = false;
                this.piece3Obj.inVert = true;
            }
        }
        else if(this.piece3Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece3, this.piece3Obj.path[0], this.piece3Obj.path[1], this.piece3Obj.path[2]);
            this.piece3Obj.inVert = false;
        }
        else if(this.piece3Obj.inVert){
            this.pieceMovesVertical(this.piece3, this.piece3Obj.path[3], this.piece3Obj.path[4], this.piece3Obj.path[5]);
            this.piece3Obj.inHoriz = false;
        }
    }
    hitPiece4(){
        console.log("TOUCHING PIECE FOUR");
        if(this.piece4.x == this.piece4Obj.path[3] && this.piece4.y == this.piece4Obj.path[0]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece4, this.piece4Obj.path[0], this.piece4Obj.path[1], this.piece4Obj.path[2]);
                this.piece4Obj.inHoriz = true;
                this.piece4Obj.inVert = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece4, this.piece4Obj.path[3], this.piece4Obj.path[4], this.piece4Obj.path[5]);
                this.piece4Obj.inHoriz = false;
                this.piece4Obj.inVert = true;
            }
        }
        else if(this.piece4Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece4, this.piece4Obj.path[0], this.piece4Obj.path[1], this.piece4Obj.path[2]);
            this.piece4Obj.inVert = false;
        }
        else if(this.piece4Obj.inVert){
            this.pieceMovesVertical(this.piece4, this.piece4Obj.path[3], this.piece4Obj.path[4], this.piece4Obj.path[5]);
            this.piece4Obj.inHoriz = false;
        }
    }
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
}