class Puzzle2 extends Room{
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
        this.piece1Obj = {
            path: [150, 200, 600, 600, 150, 550],
            target: [600, 550],
            inVert1: false,
            inVert2: false,
            inHoriz: true
        }
        this.piece1 = this.physics.add.sprite(this.piece1Obj.path[1], this.piece1Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece2Obj = {
            path: [500, 250, 550, 250, 300, 500, 300, 250, 450],
            target: [300, 450],
            inVert1: true,
            inVert2: false,
            inHoriz: false
        }
        this.piece2 = this.physics.add.sprite(this.piece2Obj.path[0], this.piece2Obj.path[2], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
        this.piece3Obj = {
            path: [400, 550, 900],
            target: [900, 400]
        }
        this.piece3 = this.physics.add.sprite(this.piece3Obj.path[2], this.piece3Obj.path[0], this.pieceStr).setOrigin(0, 0).setScale(this.wallScale).setBounce(0);
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
        if(this.piece1.y == this.piece1Obj.path[0] && this.piece1.x == this.piece1Obj.path[3]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
                this.piece1Obj.inHoriz = true;
                this.piece1Obj.inVert = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece1, this.piece1Obj.path[3], this.piece1Obj.path[4], this.piece1Obj.path[5]);
                this.piece1Obj.inHoriz = false;
                this.piece1Obj.inVert = true;
            }
        }
        else if(this.piece1Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece1, this.piece1Obj.path[0], this.piece1Obj.path[1], this.piece1Obj.path[2]);
            this.piece1Obj.inVert = false;
        }
        else if(this.piece1Obj.inVert){
            this.pieceMovesVertical(this.piece1, this.piece1Obj.path[3], this.piece1Obj.path[4], this.piece1Obj.path[5]);
            this.piece1Obj.inHoriz = false;
        }
    }
    hitPiece2(){
        if(this.piece2.x == this.piece2Obj.path[0] && this.piece2.y == this.piece2Obj.path[3]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[3], this.piece2Obj.path[4], this.piece2Obj.path[5]);
                this.piece2Obj.inHoriz = true;
                this.piece2Obj.inVert1 = false;
                this.piece2Obj.inVert2 = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
                this.piece2Obj.inHoriz = false;
                this.piece2Obj.inVert1 = true;
                this.piece2Obj.inVert2 = false;
            }
        }
        else if(this.piece2.y == this.piece2Obj.path[3] && this.piece2.x == this.piece2Obj.path[4]){
            if(this.player.body.touching.left || this.player.body.touching.right){
                this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[3], this.piece2Obj.path[4], this.piece2Obj.path[5]);
                this.piece2Obj.inHoriz = true;
                this.piece2Obj.inVert1 = false;
                this.piece2Obj.inVert2 = false;
            }
            else if(this.player.body.touching.down || this.player.body.touching.up){
                this.pieceMovesVertical(this.piece2, this.piece2Obj.path[6], this.piece2Obj.path[7], this.piece2Obj.path[8]);
                this.piece2Obj.inHoriz = false;
                this.piece2Obj.inVert1 = false;
                this.piece2Obj.inVert2 = true;
            }
        }
        else if(this.piece2Obj.inHoriz){
            this.pieceMovesHorizontal(this.piece2, this.piece2Obj.path[3], this.piece2Obj.path[4], this.piece2Obj.path[5]);
            this.piece2Obj.inVert1 = false;
            this.piece2Obj.inVert2 = false;
        }
        else if(this.piece2Obj.inVert1){
            this.pieceMovesVertical(this.piece2, this.piece2Obj.path[0], this.piece2Obj.path[1], this.piece2Obj.path[2]);
            this.piece2Obj.inHoriz = false;
            this.piece2Obj.inVert2 = false;
        }
        else if(this.piece2Obj.inVert2){
            this.pieceMovesVertical(this.piece2, this.piece2Obj.path[6], this.piece2Obj.path[7], this.piece2Obj.path[8]);
            this.piece2Obj.inHoriz = false;
            this.piece2Obj.inVert1 = false;
        }
    }
    hitPiece3(){
        this.pieceMovesHorizontal(this.piece3, this.piece3Obj.path[0], this.piece3Obj.path[1], this.piece3Obj.path[2]);
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