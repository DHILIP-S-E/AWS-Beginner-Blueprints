// Dynamic Particle Background System
// Animated particles representing data flow and connections

const ParticleBackground = {
  canvas: null,
  ctx: null,
  particles: [],
  connections: [],
  animationId: null,
  mouse: { x: null, y: null },
  
  config: {
    particleCount: 80,
    particleSize: 2,
    particleSpeed: 0.5,
    connectionDistance: 150,
    mouseRadius: 200,
    colors: {
      particle: 'rgba(255, 153, 0, 0.6)',
      connection: 'rgba(255, 153, 0, 0.15)',
      mouseConnection: 'rgba(255, 153, 0, 0.3)'
    }
  },
  
  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  },
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 1
      });
    }
  },
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  },
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  },
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.mouseRadius) {
          const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
          particle.vx -= (dx / distance) * force * 0.1;
          particle.vy -= (dy / distance) * force * 0.1;
        }
      }
      
      // Limit speed
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > this.config.particleSpeed * 2) {
        particle.vx = (particle.vx / speed) * this.config.particleSpeed * 2;
        particle.vy = (particle.vy / speed) * this.config.particleSpeed * 2;
      }
    });
  },
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.colors.particle;
      this.ctx.fill();
    });
  },
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = 1 - (distance / this.config.connectionDistance);
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.config.colors.connection.replace('0.15', opacity * 0.15);
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
      
      // Mouse connections
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - this.particles[i].x;
        const dy = this.mouse.y - this.particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.mouseRadius) {
          const opacity = 1 - (distance / this.config.mouseRadius);
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = this.config.colors.mouseConnection.replace('0.3', opacity * 0.3);
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }
      }
    }
  },
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
  
  updateTheme(theme) {
    if (theme === 'dark') {
      this.config.colors = {
        particle: 'rgba(255, 153, 0, 0.8)',
        connection: 'rgba(255, 153, 0, 0.2)',
        mouseConnection: 'rgba(255, 153, 0, 0.4)'
      };
    } else {
      this.config.colors = {
        particle: 'rgba(255, 153, 0, 0.6)',
        connection: 'rgba(255, 153, 0, 0.15)',
        mouseConnection: 'rgba(255, 153, 0, 0.3)'
      };
    }
  }
};

// Export
window.ParticleBackground = ParticleBackground;
