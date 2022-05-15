class Room extends Phaser.Scene{
    constructor(name){
        super(name);
        this.sceneName = name;

        //determine room x and y
        let roomNum = name.substring(name.indexOf('_') + 1);
        this.roomX = parseInt(roomNum.substring(0, 1));
        this.roomY = parseInt(roomNum.substring(1));

        //stage num
        this.stageNum = parseInt(name.substring(5, name.indexOf('_'))) - 1;
        this.doorPos = [(0,0), (0,0), (0,0), (0,0)]

    }
    
    create() {
       keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
       keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
       keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
       keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
       keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        console.log(this.sceneName);
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            if(gameRooms[this.stageNum].map[this.roomX][this.roomY].exits.right) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomX + 1][this.roomY].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room right");
            } 
            
        }
        else if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if(gameRooms[this.stageNum].map[this.roomX][this.roomY].exits.left) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomX - 1][this.roomY].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room left");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyUP)) {
            if(gameRooms[this.stageNum].map[this.roomX][this.roomY].exits.up) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomX][this.roomY + 1].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room up");
            } 

        }
        else if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            if(gameRooms[this.stageNum].map[this.roomX][this.roomY].exits.down) {
                this.scene.start(gameRooms[this.stageNum].map[this.roomX][this.roomY - 1].exits.scene.sceneName, "MADE");
            }
            else {
                console.log("no room down");
            } 

        }
    }
    playerSpawnPos() {
        switch(this.scene.settings.data[0]){
            case "RIGHT":
                
                
        }
    }
    doorPosCalc() {

    }
}