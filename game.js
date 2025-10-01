class BossGame {
    constructor() {
        this.player = {
            hp: 100,
            maxHp: 100,
            attack: 15,
            heal: 20,
            specialAttack: 25
        };
        
        this.boss = {
            hp: 200,
            maxHp: 200,
            attack: 20
        };
        
        this.gameOver = false;
        this.specialAttacks = 3;
        
        this.initializeElements();
        this.updateDisplay();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.playerHealthBar = document.getElementById('playerHealth');
        this.bossHealthBar = document.getElementById('bossHealth');
        this.playerHpText = document.getElementById('playerHp');
        this.bossHpText = document.getElementById('bossHp');
        this.log = document.getElementById('log');
        this.attackBtn = document.getElementById('attackBtn');
        this.healBtn = document.getElementById('healBtn');
        this.specialBtn = document.getElementById('specialBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.playerSprite = document.querySelector('.player .sprite');
        this.bossSprite = document.querySelector('.boss .sprite');
    }
    
    setupEventListeners() {
        this.attackBtn.addEventListener('click', () => this.playerAttack());
        this.healBtn.addEventListener('click', () => this.playerHeal());
        this.specialBtn.addEventListener('click', () => this.playerSpecialAttack());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    playerAttack() {
        if (this.gameOver) return;
        
        // Player attacks boss
        const damage = this.player.attack;
        this.boss.hp -= damage;
        this.addToLog(`You attack Boss for ${damage} damage!`, 'player');
        this.animateAttack(this.playerSprite);
        this.animateHit(this.bossSprite);
        
        this.updateDisplay();
        
        if (this.boss.hp <= 0) {
            this.winGame();
            return;
        }
        
        // Boss attacks back
        setTimeout(() => this.bossAttack(), 1000);
    }
    
    playerHeal() {
        if (this.gameOver) return;
        
        const healAmount = this.player.heal;
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        this.addToLog(`You heal yourself for ${healAmount} HP!`, 'heal');
        
        this.updateDisplay();
        
        // Boss attacks after heal
        setTimeout(() => this.bossAttack(), 1000);
    }
    
    playerSpecialAttack() {
        if (this.gameOver || this.specialAttacks <= 0) return;
        
        this.specialAttacks--;
        const damage = this.player.specialAttack;
        this.boss.hp -= damage;
        this.addToLog(`✨ SPECIAL ATTACK! You hit Boss for ${damage} damage!`, 'special');
        this.animateAttack(this.playerSprite);
        this.animateHit(this.bossSprite);
        
        this.updateDisplay();
        this.updateSpecialButton();
        
        if (this.boss.hp <= 0) {
            this.winGame();
            return;
        }
        
        setTimeout(() => this.bossAttack(), 1000);
    }
    
    bossAttack() {
        if (this.gameOver) return;
        
        const damage = this.boss.attack;
        this.player.hp -= damage;
        this.addToLog(`Boss attacks you for ${damage} damage!`, 'boss');
        this.animateAttack(this.bossSprite);
        this.animateHit(this.playerSprite);
        
        this.updateDisplay();
        
        if (this.player.hp <= 0) {
            this.loseGame();
        }
    }
    
    animateAttack(sprite) {
        sprite.classList.add('attack-animation');
        setTimeout(() => {
            sprite.classList.remove('attack-animation');
        }, 300);
    }
    
    animateHit(sprite) {
        sprite.classList.add('boss-hit');
        setTimeout(() => {
            sprite.classList.remove('boss-hit');
        }, 300);
    }
    
    updateDisplay() {
        // Update health bars
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        const bossHpPercent = (this.boss.hp / this.boss.maxHp) * 100;
        
        this.playerHealthBar.style.width = `${playerHpPercent}%`;
        this.bossHealthBar.style.width = `${bossHpPercent}%`;
        
        // Update HP text
        this.playerHpText.textContent = this.player.hp;
        this.bossHpText.textContent = Math.max(0, this.boss.hp);
        
        // Update button states
        this.healBtn.disabled = this.gameOver;
        this.attackBtn.disabled = this.gameOver;
        this.specialBtn.disabled = this.gameOver || this.specialAttacks <= 0;
    }
    
    updateSpecialButton() {
        this.specialBtn.textContent = `✨ Special (${this.specialAttacks})`;
        if (this.specialAttacks <= 0) {
            this.specialBtn.disabled = true;
        }
    }
    
    addToLog(message, type = 'info') {
        const p = document.createElement('p');
        p.textContent = message;
        
        switch(type) {
            case 'player':
                p.style.borderLeftColor = '#2196F3';
                break;
            case 'boss':
                p.style.borderLeftColor = '#f44336';
                break;
            case 'heal':
                p.style.borderLeftColor = '#4CAF50';
                break;
            case 'special':
                p.style.borderLeftColor = '#FFD700';
                break;
            default:
                p.style.borderLeftColor = '#666';
        }
        
        this.log.appendChild(p);
        this.log.scrollTop = this.log.scrollHeight;
    }
    
    winGame() {
        this.gameOver = true;
        this.addToLog('🎉 VICTORY! You defeated the Evil Boss!', 'special');
        this.addToLog('Click "Reset Game" to play again!', 'info');
        this.bossSprite.textContent = '💀';
    }
    
    loseGame() {
        this.gameOver = true;
        this.addToLog('💀 GAME OVER! The Boss defeated you...', 'boss');
        this.addToLog('Click "Reset Game" to try again!', 'info');
        this.playerSprite.textContent = '😵';
    }
    
    resetGame() {
        this.player.hp = this.player.maxHp;
        this.boss.hp = this.boss.maxHp;
        this.gameOver = false;
        this.specialAttacks = 3;
        
        this.log.innerHTML = '<p>Game started! Defeat the Evil Boss!</p>';
        this.playerSprite.textContent = '🦸';
        this.bossSprite.textContent = '👹';
        this.specialBtn.textContent = '✨ Special Attack';
        
        this.updateDisplay();
        this.updateSpecialButton();
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BossGame();
});
