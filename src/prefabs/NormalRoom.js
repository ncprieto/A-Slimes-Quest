class Normal extends Room{
    constructor(name){
        super(name);
        console.log("NORMAL");
        this.enemies = [];
        this.made = false;
        this.warning = [];
        this.numEnemies = 0;
    }
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
    hitEnemy(player, enemy) {
        if(player.size > enemy.size) {
            this.enemies[enemy.number] = null;
            enemy.destroy();
            this.numEnemies --;
            player.size += 0.1;
        }
        else {
            this.enemies[enemy.number] = null;
            enemy.destroy();
            this.numEnemies --;
            player.size -= 0.1;
        }
        
    }
}