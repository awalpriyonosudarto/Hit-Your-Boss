class BossGame {
    constructor() {
        this.gameState = {
            player: {
                // CURRENT STATS
                hp: 100,
                maxHp: 100,
                attack: 15,
                strongAttack: 25,
                specialAttack: 35,
                heal: 20,
                potionHeal: 30,
                isDefending: false,
                specialAttacks: 3,
                items: 3,
                
                // NEW LEVEL SYSTEM
                level: 1,
                exp: 0,
                expToNextLevel: 100,
                skillPoints: 0,
                totalExp: 0,
                
                // BASE STATS untuk reference
                baseMaxHp: 100,
                baseAttack: 15,
                baseHeal: 20
            },
            
            boss: {
                hp: 200,
                maxHp: 200,
                attack: 20,
                strongAttack: 30,
                rage: 0,
                maxRage: 100,
                isEnraged: false
            },
            
            battle: {
                turn: 1,
                isPlayerTurn: true,
                gameOver: false,
                isPaused: false,
                soundEnabled: true,
                difficulty: 'normal',
                damageDealt: 0,
                damageTaken: 0,
                startTime: null,
                timerInterval: null
            },
            
            cooldowns: {
                strongAttack: 0,
                defend: 0
            }
        };

        this.initializeGame();
    }

    initializeGame() {
        this.initializeElements();
        this.setupEventListeners();
        this.setDifficulty();
        this.startBattleTimer();
        this.showMessage('Battle started! Defeat the Evil Boss!', 'system');
        this.updateDisplay();
    }

    initializeElements() {
        // Health Elements
        this.playerHealthBar = document.getElementById('playerHealth');
        this.bossHealthBar = document.getElementById('bossHealth');
        this.playerHpText = document.getElementById('playerHp');
        this.bossHpText = document.getElementById('bossHp');
        this.specialCount = document.getElementById('specialCount');
        this.rageMeter = document.getElementById('rageMeter');

        // NEW: Level & EXP Elements
        this.playerLevel = document.getElementById('playerLevel');
        this.playerLevelBadge = document.getElementById('playerLevelBadge');
        this.currentExp = document.getElementById('currentExp');
        this.nextLevelExp = document.getElementById('nextLevelExp');
        this.expFill = document.getElementById('expFill');
        this.skillPoints = document.getElementById('skillPoints');
        this.playerMaxHp = document.getElementById('playerMaxHp');
        this.bossMaxHp = document.getElementById('bossMaxHp');

        // Character Elements
        this.playerSprite = document.getElementById('playerSprite');
        this.bossSprite = document.getElementById('bossSprite');
        this.playerStatus = document.getElementById('playerStatus');
        this.bossStatus = document.getElementById('bossStatus');
        this.playerEffects = document.getElementById('playerEffects');
        this.bossEffects = document.getElementById('bossEffects');

        // Battle Stats
        this.turnCount = document.getElementById('turnCount');
        this.damageDealt = document.getElementById('damageDealt');
        this.damageTaken = document.getElementById('damageTaken');
        this.battleTimer = document.getElementById('battleTimer');

        // Cooldown Elements
        this.strongAttackCooldown = document.getElementById('strongAttackCooldown');
        this.defendCooldown = document.getElementById('defendCooldown');

        // Action Buttons
        this.attackBtn = document.getElementById('attackBtn');
        this.strongAttackBtn = document.getElementById('strongAttackBtn');
        this.healBtn = document.getElementById('healBtn');
        this.specialBtn = document.getElementById('specialBtn');
        this.defendBtn = document.getElementById('defendBtn');
        this.itemBtn = document.getElementById('itemBtn');

        // Control Buttons
        this.resetBtn = document.getElementById('resetBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.soundBtn = document.getElementById('soundBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');

        // Settings
        this.difficultySelect = document.getElementById('difficultySelect');

        // Game Log
        this.log = document.getElementById('log');

        // Animation Elements
        this.animationElements = {
            playerSword: document.getElementById('playerSword'),
            playerArrow: document.getElementById('playerArrow'),
            playerMagic: document.getElementById('playerMagic'),
            bossFireball: document.getElementById('bossFireball'),
            bossDarkness: document.getElementById('bossDarkness'),
            bossLightning: document.getElementById('bossLightning'),
            explosion: document.getElementById('explosion'),
            bigExplosion: document.getElementById('bigExplosion'),
            magicExplosion: document.getElementById('magicExplosion'),
            playerHit: document.getElementById('playerHit'),
            bossHit: document.getElementById('bossHit'),
            healEffect: document.getElementById('healEffect'),
            shieldEffect: document.getElementById('shieldEffect'),
            criticalEffect: document.getElementById('criticalEffect'),
            rageEffect: document.getElementById('rageEffect')
        };

        // Game Message
        this.gameMessage = document.getElementById('gameMessage');
        this.messageContent = document.getElementById('messageContent');
    }

    setupEventListeners() {
        // Action Buttons
        this.attackBtn.addEventListener('click', () => this.playerAttack('normal'));
        this.strongAttackBtn.addEventListener('click', () => this.playerAttack('strong'));
        this.healBtn.addEventListener('click', () => this.playerHeal());
        this.specialBtn.addEventListener('click', () => this.playerAttack('special'));
        this.defendBtn.addEventListener('click', () => this.playerDefend());
        this.itemBtn.addEventListener('click', () => this.useItem());

        // Control Buttons
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.soundBtn.addEventListener('click', () => this.toggleSound());
        this.clearLogBtn.addEventListener('click', () => this.clearLog());

        // Settings
        this.difficultySelect.addEventListener('change', () => this.setDifficulty());

        // Keyboard Controls
        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
    }

    handleKeyboardInput(e) {
        if (this.gameState.battle.gameOver || this.gameState.battle.isPaused) return;

        switch(e.key) {
            case '1':
            case 'a':
                this.playerAttack('normal');
                break;
            case '2':
            case 's':
                this.playerAttack('strong');
                break;
            case '3':
            case 'd':
                this.playerHeal();
                break;
            case '4':
            case 'f':
                this.playerAttack('special');
                break;
            case '5':
            case 'g':
                this.playerDefend();
                break;
            case '6':
            case 'h':
                this.useItem();
                break;
            case ' ':
                this.togglePause();
                break;
            case 'r':
                this.resetGame();
                break;
        }
    }

    setDifficulty() {
        this.gameState.battle.difficulty = this.difficultySelect.value;
        
        const difficulties = {
            easy: { playerHp: 120, bossHp: 150, bossAttack: 15 },
            normal: { playerHp: 100, bossHp: 200, bossAttack: 20 },
            hard: { playerHp: 80, bossHp: 250, bossAttack: 25 }
        };

        const diff = difficulties[this.gameState.battle.difficulty];
        
        // Apply base stats + level bonuses
        const levelBonusHp = (this.gameState.player.level - 1) * 10;
        const levelBonusAttack = (this.gameState.player.level - 1) * 2;
        
        this.gameState.player.baseMaxHp = diff.playerHp;
        this.gameState.player.maxHp = diff.playerHp + levelBonusHp;
        this.gameState.player.hp = Math.min(this.gameState.player.hp, this.gameState.player.maxHp);
        
        this.gameState.player.baseAttack = 15;
        this.gameState.player.attack = this.gameState.player.baseAttack + levelBonusAttack;
        
        this.gameState.boss.maxHp = diff.bossHp;
        this.gameState.boss.hp = diff.bossHp;
        this.gameState.boss.attack = diff.bossAttack;
        this.gameState.boss.strongAttack = diff.bossAttack + 10;

        this.updateDisplay();
        this.showMessage(`Difficulty set to: ${this.gameState.battle.difficulty.toUpperCase()}`, 'system');
    }

    // ========== NEW LEVEL SYSTEM METHODS ==========

    gainExp(expAmount) {
        this.gameState.player.exp += expAmount;
        this.gameState.player.totalExp += expAmount;
        
        this.addToLog(`🎉 Gained ${expAmount} EXP!`, 'system');
        
        // Check level up
        if (this.gameState.player.exp >= this.gameState.player.expToNextLevel) {
            this.levelUp();
        }
        
        this.updateDisplay();
    }

    levelUp() {
        this.gameState.player.level++;
        this.gameState.player.skillPoints++;
        this.gameState.player.exp -= this.gameState.player.expToNextLevel;
        
        // Increase EXP needed for next level
        this.gameState.player.expToNextLevel = Math.floor(this.gameState.player.expToNextLevel * 1.5);
        
        // Auto stat improvements on level up
        this.gameState.player.maxHp += 10;
        this.gameState.player.hp = this.gameState.player.maxHp; // Full heal on level up
        this.gameState.player.attack += 2;
        this.gameState.player.heal += 3;
        
        // Update base stats untuk difficulty calculations
        this.gameState.player.baseMaxHp += 10;
        this.gameState.player.baseAttack += 2;
        
        // Show level up message
        this.showLevelUpMessage();
        this.addToLog(`🎊 LEVEL UP! Reached Level ${this.gameState.player.level}`, 'victory');
        this.addToLog(`❤️ +10 Max HP | ⚔️ +2 Attack | ✨ +1 Skill Point`, 'system');
        
        this.updateDisplay();
    }

    showLevelUpMessage() {
        const message = `LEVEL UP! Reached Level ${this.gameState.player.level}`;
        this.showMessage(message, 'victory');
        
        // Special effect untuk level up
        this.playerSprite.classList.add('level-up-animation');
        setTimeout(() => {
            this.playerSprite.classList.remove('level-up-animation');
        }, 1000);
    }

    // ========== COMBAT METHODS ==========

    async playerAttack(type) {
        if (!this.canPerformAction()) return;

        this.disableActions();
        let damage = 0;
        let animationType = '';

        switch(type) {
            case 'normal':
                damage = this.gameState.player.attack;
                animationType = 'sword';
                break;
            case 'strong':
                if (this.gameState.cooldowns.strongAttack > 0) {
                    this.showMessage('Strong Attack is on cooldown!', 'warning');
                    this.enableActions();
                    return;
                }
                damage = this.gameState.player.strongAttack;
                animationType = 'arrow';
                this.gameState.cooldowns.strongAttack = 2;
                break;
            case 'special':
                if (this.gameState.player.specialAttacks <= 0) {
                    this.showMessage('No special attacks remaining!', 'warning');
                    this.enableActions();
                    return;
                }
                damage = this.gameState.player.specialAttack;
                animationType = 'magic';
                this.gameState.player.specialAttacks--;
                break;
        }

        // Critical hit chance
        const isCritical = Math.random() < 0.2; // 20% critical chance
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
            this.showMessage('CRITICAL HIT!', 'critical');
        }

        // Play attack animation
        await this.playAttackAnimation(animationType, isCritical);

        // Apply damage
        this.gameState.boss.hp -= damage;
        this.gameState.battle.damageDealt += damage;

        // Add battle log
        const criticalText = isCritical ? ' 💫 CRITICAL!' : '';
        this.addToLog(`You attack Boss with ${type} attack for ${damage} damage!${criticalText}`, 'player');

        // Update boss rage
        this.updateBossRage(damage);

        this.updateDisplay();

        if (this.gameState.boss.hp <= 0) {
            this.winGame();
            return;
        }

        // Boss counter attack
        setTimeout(async () => {
            await this.bossAttack();
            this.enableActions();
            this.updateCooldowns();
        }, 1500);
    }

    async playerHeal() {
        if (!this.canPerformAction()) return;

        this.disableActions();

        const healAmount = this.gameState.player.heal;
        const oldHp = this.gameState.player.hp;
        this.gameState.player.hp = Math.min(this.gameState.player.maxHp, this.gameState.player.hp + healAmount);
        const actualHeal = this.gameState.player.hp - oldHp;

        // Play heal animation
        await this.playHealAnimation();

        this.addToLog(`You heal yourself for ${actualHeal} HP!`, 'heal');
        this.updateDisplay();

        // Boss attack after heal
        setTimeout(async () => {
            await this.bossAttack();
            this.enableActions();
        }, 1500);
    }

    async playerDefend() {
        if (!this.canPerformAction()) return;

        if (this.gameState.cooldowns.defend > 0) {
            this.showMessage('Defend is on cooldown!', 'warning');
            return;
        }

        this.disableActions();

        this.gameState.player.isDefending = true;
        this.gameState.cooldowns.defend = 3;

        // Play defend animation
        await this.playDefendAnimation();

        this.addToLog('You take a defensive stance! Next damage reduced by 50%', 'defend');
        this.playerStatus.textContent = 'Defending';
        this.updateDisplay();

        // Boss attack
        setTimeout(async () => {
            await this.bossAttack();
            this.enableActions();
        }, 1500);
    }

    async useItem() {
        if (!this.canPerformAction()) return;

        if (this.gameState.player.items <= 0) {
            this.showMessage('No items remaining!', 'warning');
            return;
        }

        this.disableActions();

        this.gameState.player.items--;
        const healAmount = this.gameState.player.potionHeal;
        const oldHp = this.gameState.player.hp;
        this.gameState.player.hp = Math.min(this.gameState.player.maxHp, this.gameState.player.hp + healAmount);
        const actualHeal = this.gameState.player.hp - oldHp;

        // Play item animation
        await this.playItemAnimation();

        this.addToLog(`You use a potion and heal for ${actualHeal} HP!`, 'item');
        this.updateDisplay();

        // Boss attack
        setTimeout(async () => {
            await this.bossAttack();
            this.enableActions();
        }, 1500);
    }

    async bossAttack() {
        if (this.gameState.battle.gameOver) return;

        this.gameState.battle.turn++;
        
        // Boss attack pattern
        let attackType = 'normal';
        if (this.gameState.boss.rage >= 80) {
            attackType = 'rage';
        } else if (this.gameState.boss.hp < this.gameState.boss.maxHp * 0.3) {
            attackType = 'desperate';
        } else if (Math.random() < 0.3) {
            attackType = 'strong';
        }

        let damage = 0;
        let animationType = '';

        switch(attackType) {
            case 'normal':
                damage = this.gameState.boss.attack;
                animationType = 'fireball';
                break;
            case 'strong':
                damage = this.gameState.boss.strongAttack;
                animationType = 'lightning';
                break;
            case 'rage':
                damage = Math.floor(this.gameState.boss.attack * 1.5);
                animationType = 'darkness';
                this.showMessage('BOSS IS ENRAGED!', 'boss');
                break;
            case 'desperate':
                damage = Math.floor(this.gameState.boss.attack * 1.3);
                animationType = 'fireball';
                this.showMessage('BOSS IS DESPERATE!', 'boss');
                break;
        }

        // Apply defense reduction
        if (this.gameState.player.isDefending) {
            damage = Math.floor(damage * 0.5);
            this.gameState.player.isDefending = false;
            this.playerStatus.textContent = 'Ready';
        }

        // Play boss attack animation
        await this.playBossAttackAnimation(animationType);

        // Apply damage
        this.gameState.player.hp -= damage;
        this.gameState.battle.damageTaken += damage;

        this.addToLog(`Boss attacks you for ${damage} damage!`, 'boss');
        this.updateDisplay();

        if (this.gameState.player.hp <= 0) {
            this.loseGame();
        }
    }

    updateBossRage(damage) {
        const rageIncrease = Math.floor((damage / this.gameState.boss.maxHp) * 100);
        this.gameState.boss.rage = Math.min(this.gameState.boss.maxRage, this.gameState.boss.rage + rageIncrease);
        
        if (this.gameState.boss.rage >= 80 && !this.gameState.boss.isEnraged) {
            this.gameState.boss.isEnraged = true;
            this.showMessage('BOSS ENTERS RAGE MODE!', 'boss');
            this.playRageAnimation();
        }
    }

    // ========== ANIMATION METHODS ==========

    async playAttackAnimation(type, isCritical = false) {
        return new Promise((resolve) => {
            let projectile, effect;
            
            switch(type) {
                case 'sword':
                    projectile = this.animationElements.playerSword;
                    effect = this.animationElements.explosion;
                    projectile.textContent = '⚔️';
                    effect.textContent = '💥';
                    break;
                case 'arrow':
                    projectile = this.animationElements.playerArrow;
                    effect = this.animationElements.bigExplosion;
                    projectile.textContent = '🏹';
                    effect.textContent = '💫';
                    break;
                case 'magic':
                    projectile = this.animationElements.playerMagic;
                    effect = this.animationElements.magicExplosion;
                    projectile.textContent = '🔮';
                    effect.textContent = '✨';
                    break;
            }

            if (isCritical) {
                this.animationElements.criticalEffect.style.animation = 'criticalEffect 1s ease-out';
            }

            projectile.style.animation = 'playerAttack 0.6s ease-in-out';
            
            setTimeout(() => {
                effect.style.animation = 'bossExplosion 0.4s ease-out';
                this.bossSprite.classList.add('hit-flash');
            }, 500);

            setTimeout(() => {
                projectile.style.animation = '';
                effect.style.animation = '';
                this.bossSprite.classList.remove('hit-flash');
                this.animationElements.criticalEffect.style.animation = '';
                resolve();
            }, 900);
        });
    }

    async playBossAttackAnimation(type) {
        return new Promise((resolve) => {
            let projectile, effect;
            
            switch(type) {
                case 'fireball':
                    projectile = this.animationElements.bossFireball;
                    effect = this.animationElements.playerHit;
                    projectile.textContent = '🔥';
                    effect.textContent = '💢';
                    break;
                case 'lightning':
                    projectile = this.animationElements.bossLightning;
                    effect = this.animationElements.playerHit;
                    projectile.textContent = '⚡';
                    effect.textContent = '💢';
                    break;
                case 'darkness':
                    projectile = this.animationElements.bossDarkness;
                    effect = this.animationElements.playerHit;
                    projectile.textContent = '⚫';
                    effect.textContent = '💢';
                    break;
            }

            projectile.style.animation = 'bossAttack 0.6s ease-in-out';
            
            setTimeout(() => {
                effect.style.animation = 'playerHit 0.4s ease-out';
                this.playerSprite.classList.add('hit-flash');
            }, 500);

            setTimeout(() => {
                projectile.style.animation = '';
                effect.style.animation = '';
                this.playerSprite.classList.remove('hit-flash');
                resolve();
            }, 900);
        });
    }

    async playHealAnimation() {
        return new Promise((resolve) => {
            this.animationElements.healEffect.style.animation = 'healEffect 0.8s ease-out';
            this.playerSprite.classList.add('hit-flash');
            
            setTimeout(() => {
                this.animationElements.healEffect.style.animation = '';
                this.playerSprite.classList.remove('hit-flash');
                resolve();
            }, 800);
        });
    }

    async playDefendAnimation() {
        return new Promise((resolve) => {
            this.animationElements.shieldEffect.style.animation = 'healEffect 0.8s ease-out';
            this.playerSprite.classList.add('hit-flash');
            
            setTimeout(() => {
                this.animationElements.shieldEffect.style.animation = '';
                this.playerSprite.classList.remove('hit-flash');
                resolve();
            }, 800);
        });
    }

    async playItemAnimation() {
        return new Promise((resolve) => {
            const healEffect = document.createElement('div');
            healEffect.className = 'effect';
            healEffect.textContent = '🧪';
            healEffect.style.cssText = `
                position: absolute;
                left: 150px;
                top: 50%;
                font-size: 2em;
                animation: healEffect 0.8s ease-out;
            `;
            document.querySelector('.animation-container').appendChild(healEffect);
            
            this.playerSprite.classList.add('hit-flash');
            
            setTimeout(() => {
                healEffect.remove();
                this.playerSprite.classList.remove('hit-flash');
                resolve();
            }, 800);
        });
    }

    async playRageAnimation() {
        return new Promise((resolve) => {
            this.animationElements.rageEffect.style.animation = 'specialExplosion 1s ease-out';
            this.bossSprite.classList.add('hit-flash');
            
            setTimeout(() => {
                this.animationElements.rageEffect.style.animation = '';
                this.bossSprite.classList.remove('hit-flash');
                resolve();
            }, 1000);
        });
    }

    // ========== GAME STATE MANAGEMENT ==========

    canPerformAction() {
        if (this.gameState.battle.gameOver) {
            this.showMessage('Game over! Start a new game.', 'warning');
            return false;
        }
        if (this.gameState.battle.isPaused) {
            this.showMessage('Game is paused!', 'warning');
            return false;
        }
        if (!this.gameState.battle.isPlayerTurn) {
            this.showMessage('Wait for your turn!', 'warning');
            return false;
        }
        return true;
    }

    disableActions() {
        this.gameState.battle.isPlayerTurn = false;
        const buttons = [this.attackBtn, this.strongAttackBtn, this.healBtn, this.specialBtn, this.defendBtn, this.itemBtn];
        buttons.forEach(btn => btn.disabled = true);
    }

    enableActions() {
        this.gameState.battle.isPlayerTurn = true;
        const buttons = [this.attackBtn, this.healBtn, this.specialBtn, this.itemBtn];
        buttons.forEach(btn => btn.disabled = false);

        // Enable strong attack if not on cooldown
        this.strongAttackBtn.disabled = this.gameState.cooldowns.strongAttack > 0;
        
        // Enable defend if not on cooldown
        this.defendBtn.disabled = this.gameState.cooldowns.defend > 0;

        // Enable special attack if available
        this.specialBtn.disabled = this.gameState.player.specialAttacks <= 0;

        // Enable item if available
        this.itemBtn.disabled = this.gameState.player.items <= 0;
    }

    updateCooldowns() {
        if (this.gameState.cooldowns.strongAttack > 0) {
            this.gameState.cooldowns.strongAttack--;
        }
        if (this.gameState.cooldowns.defend > 0) {
            this.gameState.cooldowns.defend--;
        }
        this.updateCooldownDisplay();
    }

    updateCooldownDisplay() {
        const strongCooldownPercent = (this.gameState.cooldowns.strongAttack / 2) * 100;
        const defendCooldownPercent = (this.gameState.cooldowns.defend / 3) * 100;

        this.strongAttackCooldown.style.width = `${strongCooldownPercent}%`;
        this.defendCooldown.style.width = `${defendCooldownPercent}%`;
    }

    updateDisplay() {
        // Update health bars
        const playerHpPercent = (this.gameState.player.hp / this.gameState.player.maxHp) * 100;
        const bossHpPercent = (this.gameState.boss.hp / this.gameState.boss.maxHp) * 100;

        this.playerHealthBar.style.width = `${playerHpPercent}%`;
        this.bossHealthBar.style.width = `${bossHpPercent}%`;

        // Update text
        this.playerHpText.textContent = this.gameState.player.hp;
        this.bossHpText.textContent = Math.max(0, this.gameState.boss.hp);
        this.playerMaxHp.textContent = this.gameState.player.maxHp;
        this.bossMaxHp.textContent = this.gameState.boss.maxHp;
        this.specialCount.textContent = this.gameState.player.specialAttacks;
        this.rageMeter.textContent = `${this.gameState.boss.rage}%`;

        // NEW: Update level & EXP
        this.playerLevel.textContent = this.gameState.player.level;
        this.playerLevelBadge.textContent = `Lv.${this.gameState.player.level}`;
        this.currentExp.textContent = this.gameState.player.exp;
        this.nextLevelExp.textContent = this.gameState.player.expToNextLevel;
        this.skillPoints.textContent = this.gameState.player.skillPoints;

        // Update EXP bar
        const expPercent = (this.gameState.player.exp / this.gameState.player.expToNextLevel) * 100;
        this.expFill.style.width = `${expPercent}%`;

        // Update battle stats
        this.turnCount.textContent = this.gameState.battle.turn;
        this.damageDealt.textContent = this.gameState.battle.damageDealt;
        this.damageTaken.textContent = this.gameState.battle.damageTaken;

        // Update character status
        if (this.gameState.player.hp < this.gameState.player.maxHp * 0.3) {
            this.playerStatus.textContent = 'Injured';
            this.playerStatus.style.color = '#ff6b6b';
        } else {
            this.playerStatus.textContent = 'Ready';
            this.playerStatus.style.color = '#4ecdc4';
        }

        if (this.gameState.boss.isEnraged) {
            this.bossStatus.textContent = 'ENRAGED!';
            this.bossStatus.style.color = '#ff0000';
        } else if (this.gameState.boss.hp < this.gameState.boss.maxHp * 0.3) {
            this.bossStatus.textContent = 'Weak';
            this.bossStatus.style.color = '#ffa726';
        } else {
            this.bossStatus.textContent = 'Angry';
            this.bossStatus.style.color = '#ff6b6b';
        }

        this.updateCooldownDisplay();
        this.enableActions();
    }

    startBattleTimer() {
        this.gameState.battle.startTime = new Date();
        this.gameState.battle.timerInterval = setInterval(() => {
            if (!this.gameState.battle.gameOver && !this.gameState.battle.isPaused) {
                const now = new Date();
                const diff = Math.floor((now - this.gameState.battle.startTime) / 1000);
                const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
                const seconds = (diff % 60).toString().padStart(2, '0');
                this.battleTimer.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    stopBattleTimer() {
        if (this.gameState.battle.timerInterval) {
            clearInterval(this.gameState.battle.timerInterval);
        }
    }

    // ========== GAME CONTROLS ==========

    togglePause() {
        this.gameState.battle.isPaused = !this.gameState.battle.isPaused;
        this.pauseBtn.innerHTML = this.gameState.battle.isPaused ? 
            '<span class="btn-icon">▶️</span> Resume' : 
            '<span class="btn-icon">⏸️</span> Pause';
        
        if (this.gameState.battle.isPaused) {
            this.showMessage('Game Paused', 'system');
            this.disableActions();
        } else {
            this.showMessage('Game Resumed', 'system');
            this.enableActions();
        }
    }

    toggleSound() {
        this.gameState.battle.soundEnabled = !this.gameState.battle.soundEnabled;
        this.soundBtn.innerHTML = this.gameState.battle.soundEnabled ?
            '<span class="btn-icon">🔊</span> Sound' :
            '<span class="btn-icon">🔇</span> Muted';
        this.showMessage(`Sound ${this.gameState.battle.soundEnabled ? 'Enabled' : 'Disabled'}`, 'system');
    }

    resetGame() {
        this.stopBattleTimer();
        
        // Reset game state (TAPI KEEP LEVEL & EXP)
        const savedLevel = this.gameState.player.level;
        const savedExp = this.gameState.player.exp;
        const savedExpToNextLevel = this.gameState.player.expToNextLevel;
        const savedSkillPoints = this.gameState.player.skillPoints;
        const savedTotalExp = this.gameState.player.totalExp;
        const savedBaseMaxHp = this.gameState.player.baseMaxHp;
        const savedBaseAttack = this.gameState.player.baseAttack;

        this.gameState = {
            player: {
                // Reset battle stats tapi keep progression
                hp: 100 + ((savedLevel - 1) * 10),
                maxHp: 100 + ((savedLevel - 1) * 10),
                attack: 15 + ((savedLevel - 1) * 2),
                strongAttack: 25 + ((savedLevel - 1) * 2),
                specialAttack: 35 + ((savedLevel - 1) * 2),
                heal: 20 + ((savedLevel - 1) * 3),
                potionHeal: 30,
                isDefending: false,
                specialAttacks: 3,
                items: 3,
                
                // Keep level progression
                level: savedLevel,
                exp: savedExp,
                expToNextLevel: savedExpToNextLevel,
                skillPoints: savedSkillPoints,
                totalExp: savedTotalExp,
                baseMaxHp: savedBaseMaxHp,
                baseAttack: savedBaseAttack
            },
            boss: {
                hp: 200,
                maxHp: 200,
                attack: 20,
                strongAttack: 30,
                rage: 0,
                maxRage: 100,
                isEnraged: false
            },
            battle: {
                turn: 1,
                isPlayerTurn: true,
                gameOver: false,
                isPaused: false,
                soundEnabled: true,
                difficulty: 'normal',
                damageDealt: 0,
                damageTaken: 0,
                startTime: null,
                timerInterval: null
            },
            cooldowns: {
                strongAttack: 0,
                defend: 0
            }
        };

        this.setDifficulty();
        this.startBattleTimer();
        this.clearLog();
        this.addToLog('New battle started! Defeat the Evil Boss!', 'system');
        this.addToLog(`You are Level ${savedLevel} with ${savedSkillPoints} skill points`, 'system');
        this.updateDisplay();
        this.showMessage('New Game Started!', 'system');
    }

    winGame() {
        // AWARD EXP FIRST sebelum set gameOver
        const baseExp = 80;
        const turnBonus = Math.max(0, 50 - (this.gameState.battle.turn * 2));
        const damageBonus = Math.floor(this.gameState.battle.damageDealt / 10);
        const totalExp = baseExp + turnBonus + damageBonus;
        
        this.gainExp(totalExp);
        
        // THEN set game over
        this.gameState.battle.gameOver = true;
        this.stopBattleTimer();
        this.disableActions();
        
        this.bossSprite.textContent = '💀';
        this.bossStatus.textContent = 'DEFEATED';
        this.bossStatus.style.color = '#4ecdc4';
        
        this.addToLog('🎉 VICTORY! You defeated the Evil Boss!', 'victory');
        this.addToLog(`⏱️ Battle completed in ${this.battleTimer.textContent}`, 'system');
        this.addToLog(`📊 Performance: ${turnBonus} turn bonus + ${damageBonus} damage bonus`, 'system');
        this.showMessage('VICTORY! You defeated the Boss!', 'victory');
    }

    loseGame() {
        this.gameState.battle.gameOver = true;
        this.stopBattleTimer();
        this.disableActions();
        
        this.playerSprite.textContent = '😵';
        this.playerStatus.textContent = 'DEFEATED';
        this.playerStatus.style.color = '#ff6b6b';
        
        this.addToLog('💀 GAME OVER! The Boss defeated you...', 'defeat');
        this.addToLog(`You survived ${this.battleTimer.textContent}`, 'system');
        this.showMessage('GAME OVER! The Boss was too strong!', 'defeat');
    }

    // ========== UI METHODS ==========

    addToLog(message, type = 'system') {
        const now = new Date();
        const timeString = `[${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        logEntry.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-text">${message}</span>
        `;
        
        this.log.appendChild(logEntry);
        this.log.scrollTop = this.log.scrollHeight;
    }

    clearLog() {
        this.log.innerHTML = `
            <div class="log-entry system">
                <span class="log-time">[00:00]</span>
                <span class="log-text">Battle log cleared</span>
            </div>
        `;
    }

    showMessage(message, type = 'system') {
        this.messageContent.textContent = message;
        this.gameMessage.className = `game-message ${type}`;
        this.gameMessage.style.display = 'block';
        
        setTimeout(() => {
            this.gameMessage.style.display = 'none';
        }, 3000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 2000);
    }
    
    // Initialize game
    window.bossGame = new BossGame();
});
