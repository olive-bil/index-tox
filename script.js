const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 粒子数组和祝福语
let particles = [];
const messages = [
    "2025年 新年快乐！",
    "愿你万事如意！",
    "身体健康，平安幸福！",
    "天天开心，事事顺心！",
    "前途似锦，好运连连！",
    "心想事成，吉祥如意！",
    "财源滚滚，福星高照！",
    "开开心心，每一天！",
    "幸福美满，阖家欢乐！",
    "梦想成真，蒸蒸日上！"
];
let currentMessageIndex = 0;

// 粒子类
class Particle {
    constructor(x, y, color) {
        this.x = canvas.width / 2; // 初始位置在画布中央
        this.y = canvas.height / 2;
        this.targetX = x; // 目标位置
        this.targetY = y;
        this.size = 10; // 初始为大粒子
        this.color = color;
        this.speed = Math.random() * 3 + 1; // 粒子运动速度
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // 逐渐缩小粒子到最终大小
        if (this.size > 2) {
            this.size -= 0.2;
        }

        // 向目标位置移动
        this.x += (this.targetX - this.x) / this.speed;
        this.y += (this.targetY - this.y) / this.speed;

        this.draw();
    }

    disperse() {
        // 随机散开到画布任意位置
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * canvas.height;
    }

    regroup(x, y) {
        // 设置新的目标位置
        this.targetX = x;
        this.targetY = y;
        this.size = 10; // 重置为大粒子
    }
}

// 创建文字粒子
function createParticles(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    particles = [];

    for (let y = 0; y < imageData.height; y += 8) {
        for (let x = 0; x < imageData.width; x += 8) {
            const index = (y * imageData.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];

            if (r + g + b > 200) {
                const color = `rgb(${r}, ${g}, ${b})`;
                particles.push(new Particle(x, y, color));
            }
        }
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => particle.update());

    requestAnimationFrame(animate);
}

// 切换文字
function nextMessage() {
    // 粒子散开
    particles.forEach((particle) => particle.disperse());

    // 等待散开完成后显示新文字
    setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;

        // 重新组合成新文字
        const text = messages[currentMessageIndex];
        createParticles(text);
    }, 2000);
}

// 初始化
createParticles(messages[currentMessageIndex]);
animate();

// 循环播放祝福语
setInterval(nextMessage, 5000);

// 调整画布尺寸
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles(messages[currentMessageIndex]);
});