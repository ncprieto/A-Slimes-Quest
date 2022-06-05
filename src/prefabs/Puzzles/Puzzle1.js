class Puzzle1 extends Room{
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
        this.doorStr = doorStr
    }
    puzzleUpdate(player, doorPosArr, background){
        this.player =  player;
        if(this.backgroundStr == 'puzzle1_floor_stage1' && !this.puzzleMade){
            background.setTexture(this.backgroundStr);
            console.log;("MAKING PUZZLE 2 STAGE 1");
            this.makePuzzle1Stage1();
        }
        else if(this.backgroundStr == 'puzzle1_floor_stage2' && !this.puzzleMade){
            console.log("MAKING PUZZLE 2 STAGE 2");
            background.setTexture(this.backgroundStr);
            this.makePuzzle1Stage2();           
        }
        if(!this.puzzleMade){
            this.makeLockedDoor(doorPosArr);
            this.physics.add.collider(this.player, this.piece1, this.hitPiece1, null, this);
            this.physics.add.collider(this.player, this.piece2, this.hitPiece2, null, this);
            this.physics.add.collider(this.player, this.piece3, this.hitPiece3, null, this);
            this.physics.add.collider(this.player, this.lockedDoor);
            this.puzzleMade = true;
        }
        if(this.piece1.y == this.piece1Obj.target[1] && this.piece1.x == this.piece1Obj.target[0]
        && this.piece2.y == this.piece2Obj.target[1] && this.piece2.x == this.piece2Obj.target[0]
        && this.piece3.y == this.piece3Obj.target[1] && this.piece3.x == this.piece3Obj.target[0]){
            this.lockedDoor.destroy(true);
        }
    }
    makePuzzle1Stage1(){
        // this.piece?Obj holds data for the movement of the piece sprite
        // path contain data for how the piece moves path[0] is a constant
        // ie the piece will stay at x 400 and moves along y 200 through y 600
        // or stays at y 400 and moves along x 200 and x 600
        // all depends on the function being passed this data
        // target defines the coordinates for where we want the piece to land so that
        // it completes its part of the puzzle
        // if piece is at x 400 and y 600 then its target was met
        this.piece1Obj = {
            path: [368, 180, 565],
            target: [368, 180]
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[0], this.piece1Obj.path[2], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [373, 560, 848],
            target: [560, 373]
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[2], this.piece2Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [470, 176, 943, 943, 470, 568],
            target: [943, 568],
            inVert: false,
            inHoriz: true
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[1], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
    }
    makePuzzle1Stage2(){
        this.piece1Obj = {
            path: [368, 373, 470],
            target: [368, 373]
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[0], this.piece1Obj.path[2], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [177, 560, 848],
            target: [560, 177]
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[2], this.piece2Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [565, 176, 1041, 1041, 470, 568],
            target: [1041, 470],
            inVert: false,
            inHoriz: true
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[1], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
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
        this.pieceMovesVertical(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
    }
    hitPiece2(){
        console.log("TOUCHING PIECE TWO");
        this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
    }
    hitPiece3(){
        console.log("TOUCHING PIECE THREE");
        if(this.piece3.y == this.piece3Obj.path[0] && this.piece3.x == this.piece3Obj.path[3]){
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
}