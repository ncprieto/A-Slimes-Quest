class Room extends Phaser.Scene{
    constructor(name){
        super({key: 'ScreenTitle'});
        this.sceneName = name;
        this.doorPos = [(0,0), (0,0), (0,0), (0,0)]

    }
    
    create() {
       
    }
    update() {
        console.log(this.sceneName);
    }
    playerSpawnPos() {
        switch(this.scene.settings.data[0]){
            case "RIGHT":
                
                
        }
    }
    doorPosCalc() {

    }
}