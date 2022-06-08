class Boss2 extends Room{
    constructor(name){
        super(name);
    }
    bossCreate() {
        this.boss = this.physics.add.sprite(300, 300, 'eyeBoss')
        this.boss.body.setSize(350, 200);
        this.boss.body.immovable = true;
        this.threshold = 0.7;
        this.boss.play('batBossAnimation');

        this.phase = 1;
        this.pause = false;
        this.return = false;

        this.spawnAmount = 5;
        this.spawnSpeed = 1000;
        this.moveSpeed = 10;
        

        this.minions = [];
        this.warning = [];

        //timers
        this.startBoss = true;
        this.canSpawn = true;

        this.time.delayedCall(3000, function() { this.startBoss = true;}, [], this);

        //increase spawn amount
        this.time.delayedCall(10000, function() { this.spawnAmount += 3; }, [], this);
        //increase fly speed
        this.time.delayedCall(10000, function() { this.moveSpeed += 3; }, [], this);

        //Boss warning
        this.bossWarning = this.add.image(200, 200, 'warning').setOrigin(0.5, 0.5);
        this.physics.add.collider(this.player, this.boss, this.bossCol, null, this);
        
        this.timepass = 0;
        this.time.delayedCall(1000, function() { this.timepass ++; }, [], this);

        this.bossHp = 3;

        this.winScreen = this.add.image(0,0, 'eyeBossEnd').setOrigin(0,0).setAlpha(0);
        this.winScreen.depth = 1;
        this.credits = this.add.image(0,0, 'credits').setOrigin(0,0).setAlpha(0);
        this.credits.depth = 1;
        
    }
    bossUpdate() {
        //console.log(this.spawnAmount)
        this.time.delayedCall(1000, function() { this.timepass ++; }, [], this);
        if(this.startBoss) {
            //spawn minions
            for(let i = 0; i < this.spawnAmount; i++) {
                if(this.minions[i] == null && this.canSpawn) {
                    //spawn in intervals
                    this.time.delayedCall(this.spawnSpeed, function() { this.canSpawn = true;}, [], this);
                    let minion = this.physics.add.sprite(this.boss.x, this.boss.y, 'bat');
                    minion.size =  Math.floor(1 + Math.random() * 8)/10.0;
                    minion.setScale(minion.size);
                    minion.number = i;
                    minion.timedOut = true;
                    minion.play('batMove');
                    this.minions[i] = minion;
                    this.canSpawn = false;
                    this.physics.add.collider(this.player, this.minions[i], this.minionCol, null, this);

                    //die after 3 seconds
                    this.time.delayedCall(Math.floor(5000 + Math.random() * 3000), function() {if(minion.timedOut) {minion.destroy(); this.minions[i] = null;}}, [], this);
                }
            }  
            
            //move minions
            for(let i = 0; i < this.spawnAmount; i++) {
                if(this.minions[i] != null) {
                    this.physics.accelerateTo(this.minions[i], this.player.x, this.player.y, Math.floor((20 + this.moveSpeed) + Math.random() * (50 + this.moveSpeed)) , 1)
                }
            }

            //warning on minions
            for(let i = 0; i < this.spawnAmount; i++) {
                if((this.warning[i] == null) && this.minions[i] != null) {
                    let warning = this.add.image(0, 0, 'warning').setOrigin(0.5, 0.5).setScale(this.minions[i].size - this.player.size);
                    this.warning[i] = warning;
                }
                else if(this.minions[i] != null && this.warning[i] != null) {
                    this.warning[i].x = this.minions[i].x;
                    this.warning[i].y = this.minions[i].y - 75 * this.minions[i].size;
                    if(this.minions[i].size - this.player.size > 0) {
                        this.warning[i].setScale(((this.minions[i].size - this.player.size) * 2) + 0.5);
                    }
                    else {
                        this.warning[i].setScale(0);
                    }
                }
                else if(this.minions[i] == null && this.warning[i] != null) {
                    this.warning[i].setScale(0);
                }
                else if(this.minions[i] == null) {

                }
                
            }

            this.bossWarning.setScale((this.threshold - this.player.size) * 2 + 0.5);
            this.bossWarning.x = this.boss.x;
            this.bossWarning.y = this.boss.y - 100;


            //move phases when boss hp at 1
            if(this.bossHp == 1 && this.phase == 1) {
                this.pause = true;
                this.boss.alpha = Math.sin(this.timepass/100);
                if(this.boss.scale >= 0.6) {
                    this.boss.scale -= 0.01
                }
                this.time.delayedCall(3000, function() { this.phase++; this.pause = false; this.bossHp = 2;this.boss.setAlpha(1);}, [], this);
            }
            else {
                if(this.phase == 1 && !this.pause) {
                    this.boss.y = 360 + Math.sin(this.timepass/100) * 200;
                }
                else if(!this.pause) {
                    this.physics.accelerateTo(this.boss, this.player.x, this.player.y)
                }
            }

            //if boss hp is 0
            if(this.bossHp == 0) {
                this.boss.setAcceleration(0);
                this.pause = true;
                this.boss.alpha = Math.sin(this.timepass/100);
                this.boss.setScale(0.5  + (Math.sin(this.timepass) * 0.5));
                this.time.delayedCall(3000, function() { this.winScreen.alpha = 1;}, [], this);
            }
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                if(this.winScreen.alpha == 1 && !this.return) {
                    this.credits.alpha = 1;
                    this.winScreen.alpha = 0;
                    this.return = true;
                }
                else if(this.return) {
                    this.credits.alpha = 0;
                    menu.music.stop();
                    this.scene.start("menuScene");
                    
                }
            }
        }
    }
    bossCol() {
        //hit boss when big enough
        if(this.bossHp > 0) {
            if(this.player.size >= this.threshold) {
                this.physics.accelerateTo(this.player, this.boss.x, this.boss.y, -50000);
                this.time.delayedCall(500, function() { this.player.setAcceleration(0); }, [], this);
                this.bossHp --;
                this.spawnAmount += 5;
                this.moveSpeed += 10;
                this.player.size = 0.2;
            }
            else {
                this.physics.accelerateTo(this.player, this.boss.x, this.boss.y, -50000);
                this.time.delayedCall(500, function() { this.player.setAcceleration(0); }, [], this);
                this.player.hit();
            }
        }
    }
    minionCol(player, enemy) {
        if(this.bossHp > 0) {
            if(player.size >= enemy.size) {
                this.sound.play('absorb');
                this.minions[enemy.number] = null;
                enemy.destroy();
                enemy.timedOut = false;
                if(player.size <= 0.8) {
                    player.size += 0.1;
                }
            }
            else {
                this.sound.play('hit');
                this.player.hit();
            }
        }
    }
}