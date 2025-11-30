// Simple Working Features - Actually Functional

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Service Graph - Simple but Working
  const graphDemo = document.getElementById('service-graph-demo');
  if (graphDemo) {
    let selectedNode = null;
    
    graphDemo.innerHTML = `
      <div style="background:#f8f9fa;height:200px;border-radius:12px;position:relative;padding:20px;">
        <div style="position:absolute;top:10px;left:10px;font-size:12px;color:#666;">Click nodes to see connections</div>
        <div class="node" data-service="lambda" style="position:absolute;top:30px;left:30px;width:50px;height:50px;background:#3b82f6;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;">Lambda</div>
        <div class="node" data-service="api" style="position:absolute;top:30px;right:30px;width:50px;height:50px;background:#10b981;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;">API GW</div>
        <div class="node" data-service="db" style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);width:50px;height:50px;background:#f59e0b;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;">DynamoDB</div>
        <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">
          <line class="connection" x1="55" y1="55" x2="200" y2="55" stroke="#ccc" stroke-width="2"/>
          <line class="connection" x1="55" y1="55" x2="150" y2="140" stroke="#ccc" stroke-width="2"/>
          <line class="connection" x1="200" y1="55" x2="150" y2="140" stroke="#ccc" stroke-width="2"/>
        </svg>
      </div>
    `;
    
    graphDemo.querySelectorAll('.node').forEach(node => {
      node.addEventListener('click', () => {
        // Reset all
        graphDemo.querySelectorAll('.node').forEach(n => n.style.transform = 'scale(1)');
        graphDemo.querySelectorAll('.connection').forEach(c => c.setAttribute('stroke', '#ccc'));
        
        // Highlight selected
        if (selectedNode !== node.dataset.service) {
          node.style.transform = 'scale(1.2)';
          graphDemo.querySelectorAll('.connection').forEach(c => c.setAttribute('stroke', '#3b82f6'));
          selectedNode = node.dataset.service;
          alert(`Selected ${node.textContent} - Connected to other services`);
        } else {
          selectedNode = null;
        }
      });
    });
  }

  // 2. Service Comparison - Simple Modal
  window.showServiceComparison = () => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;';
    
    modal.innerHTML = `
      <div style="background:white;border-radius:12px;padding:30px;max-width:600px;width:90%;">
        <h3 style="margin:0 0 20px 0;">📊 Service Comparison</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f8f9fa;">
            <th style="padding:12px;text-align:left;border:1px solid #ddd;">Feature</th>
            <th style="padding:12px;text-align:center;border:1px solid #ddd;">Lambda</th>
            <th style="padding:12px;text-align:center;border:1px solid #ddd;">EC2</th>
            <th style="padding:12px;text-align:center;border:1px solid #ddd;">ECS</th>
          </tr>
          <tr>
            <td style="padding:12px;border:1px solid #ddd;">Serverless</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:red;">✗</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:red;">✗</td>
          </tr>
          <tr>
            <td style="padding:12px;border:1px solid #ddd;">Auto Scaling</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
          </tr>
          <tr>
            <td style="padding:12px;border:1px solid #ddd;">Free Tier</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:green;">✓</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;color:red;">✗</td>
          </tr>
          <tr>
            <td style="padding:12px;border:1px solid #ddd;">Pricing</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;">Per request</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;">Per hour</td>
            <td style="padding:12px;text-align:center;border:1px solid #ddd;">Per task</td>
          </tr>
        </table>
        <div style="margin-top:20px;text-align:center;">
          <button onclick="this.closest('div[style*=\"position:fixed\"]').remove()" style="padding:10px 20px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  };

  // 3. Regional Map - Simple Interactive
  const mapDemo = document.getElementById('availability-map-demo');
  if (mapDemo) {
    const regions = [
      {name: 'US East', x: '25%', y: '40%', services: 200},
      {name: 'US West', x: '15%', y: '45%', services: 180},
      {name: 'Europe', x: '55%', y: '35%', services: 175},
      {name: 'Asia Pacific', x: '80%', y: '50%', services: 160},
      {name: 'South America', x: '35%', y: '70%', services: 120}
    ];
    
    mapDemo.innerHTML = `
      <div style="background:linear-gradient(135deg,#1e293b,#334155);height:200px;border-radius:12px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:10px;left:10px;color:#94a3b8;font-size:12px;">🌍 AWS Regions - Click dots</div>
        <div id="region-info" style="position:absolute;top:10px;right:10px;color:#94a3b8;font-size:11px;"></div>
        ${regions.map((region, i) => `
          <div class="region-dot" data-region="${i}" style="
            position:absolute;
            top:${region.y};
            left:${region.x};
            width:12px;
            height:12px;
            background:#22c55e;
            border-radius:50%;
            cursor:pointer;
            animation:pulse 2s infinite;
          " title="${region.name}"></div>
        `).join('')}
      </div>
      <div id="selected-region" style="margin-top:10px;padding:10px;background:rgba(255,255,255,0.1);border-radius:6px;display:none;"></div>
      <style>
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .region-dot:hover { transform:scale(1.5); background:#3b82f6; }
      </style>
    `;
    
    mapDemo.querySelectorAll('.region-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const region = regions[i];
        const infoDiv = document.getElementById('selected-region');
        const regionInfo = document.getElementById('region-info');
        
        // Reset all dots
        mapDemo.querySelectorAll('.region-dot').forEach(d => {
          d.style.background = '#22c55e';
          d.style.transform = 'scale(1)';
        });
        
        // Highlight selected
        dot.style.background = '#3b82f6';
        dot.style.transform = 'scale(1.5)';
        
        // Show info
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
          <strong>${region.name}</strong><br>
          📊 ${region.services} AWS services available<br>
          🟢 Status: Operational
        `;
        
        regionInfo.textContent = `Selected: ${region.name}`;
      });
    });
  }

  // 4. Cost Calculator (already working)
  const costCalc = document.getElementById('cost-calculator-demo');
  if (costCalc) {
    costCalc.innerHTML = `
      <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);padding:20px;border-radius:12px;">
        <h4 style="color:#374151;margin:0 0 16px 0;">💰 Cost Calculator</h4>
        <div style="margin:12px 0;">
          <label style="color:#6b7280;font-size:14px;">Users: <span id="users" style="font-weight:600;color:#374151;">1000</span></label><br>
          <input type="range" id="user-slider" min="100" max="10000" value="1000" style="width:100%;margin-top:8px;">
        </div>
        <div style="margin:12px 0;">
          <label style="color:#6b7280;font-size:14px;">Storage (GB): <span id="storage" style="font-weight:600;color:#374151;">10</span></label><br>
          <input type="range" id="storage-slider" min="1" max="1000" value="10" style="width:100%;margin-top:8px;">
        </div>
        <div style="font-size:24px;text-align:center;margin-top:20px;padding:16px;background:rgba(255,255,255,0.1);border-radius:8px;">
          <span style="color:#6b7280;font-size:14px;">Estimated Cost</span><br>
          <span style="color:#059669;font-weight:bold;">$<span id="cost">25</span>/month</span>
        </div>
      </div>
    `;
    
    const updateCost = () => {
      const users = document.getElementById('user-slider').value;
      const storage = document.getElementById('storage-slider').value;
      document.getElementById('users').textContent = users;
      document.getElementById('storage').textContent = storage;
      document.getElementById('cost').textContent = Math.round(users * 0.01 + storage * 0.02 + 5);
    };
    
    document.getElementById('user-slider').oninput = updateCost;
    document.getElementById('storage-slider').oninput = updateCost;
  }

  console.log('✅ Simple working features loaded!');
});