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
        if(!this.puzzleMade){
            background.setTexture(this.backgroundStr);
            this.makePuzzle1(doorPosArr);
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
    makePuzzle1(doorPosArr){
        // this.piece?Obj holds data for the movement of the piece sprite
        // path contain data for how the piece moves path[0] is a constant
        // ie the piece will stay at x 400 and moves along y 200 through y 600
        // or stays at y 400 and moves along x 200 and x 600
        // all depends on the function being passed this data
        // target defines the coordinates for where we want the piece to land so that
        // it completes its part of the puzzle
        // if piece is at x 400 and y 600 then its target was met
        this.piece1Obj = {
            path: [400, 200, 600],
            target: [400, 600]
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[0], this.piece1Obj.path[1], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [200, 500, 800],
            target: [800, 200]
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[1], this.piece2Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [300, 500, 900, 900, 300, 600],
            target: [900, 600],
            inVert: false,
            inHoriz: true
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[1], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
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
        this.pieceMovesVertical(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
    }
    hitPiece2(){
        this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
    }
    hitPiece3(){
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