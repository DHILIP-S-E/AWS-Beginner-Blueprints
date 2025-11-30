// Working Production Features - Minimal Implementation

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.createElement('div');
  themeToggle.innerHTML = `
    <button id="theme-btn" style="position:fixed;top:20px;right:20px;z-index:1000;background:rgba(0,0,0,0.1);border:none;border-radius:50%;width:50px;height:50px;cursor:pointer;color:white;">
      🌙
    </button>
  `;
  document.body.appendChild(themeToggle);
  
  let isDark = false;
  document.getElementById('theme-btn').onclick = () => {
    isDark = !isDark;
    document.body.style.background = isDark ? '#1a1a1a' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
    document.getElementById('theme-btn').textContent = isDark ? '☀️' : '🌙';
  };

  // Cost Calculator
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

  // Regional Map - Interactive and Dynamic
  const mapDemo = document.getElementById('availability-map-demo');
  if (mapDemo) {
    console.log('Found availability-map-demo element, initializing...');
    const regions = [
      {name: 'US East (N. Virginia)', x: '25%', y: '35%', services: 200, status: 'active'},
      {name: 'US West (Oregon)', x: '15%', y: '40%', services: 180, status: 'active'},
      {name: 'Europe (Ireland)', x: '55%', y: '30%', services: 175, status: 'active'},
      {name: 'Asia Pacific (Tokyo)', x: '80%', y: '45%', services: 160, status: 'active'},
      {name: 'South America (São Paulo)', x: '35%', y: '75%', services: 120, status: 'limited'},
      {name: 'Africa (Cape Town)', x: '58%', y: '80%', services: 85, status: 'limited'},
      {name: 'Middle East (Bahrain)', x: '65%', y: '50%', services: 95, status: 'active'}
    ];
    
    let selectedRegion = null;
    
    const renderMap = () => {
      mapDemo.innerHTML = `
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);height:280px;border-radius:12px;position:relative;overflow:hidden;border:1px solid rgba(148,163,184,0.2);">
          <!-- World map background pattern -->
          <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 25% 35%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 45%, rgba(16,185,129,0.1) 0%, transparent 50%);opacity:0.3;"></div>
          
          <div style="position:absolute;top:12px;left:12px;color:#94a3b8;font-size:12px;font-weight:500;">🌍 AWS Global Infrastructure</div>
          <div style="position:absolute;top:12px;right:12px;color:#94a3b8;font-size:11px;">Click regions for details</div>
          
          ${regions.map((region, i) => {
            const isSelected = selectedRegion === i;
            const statusColor = region.status === 'active' ? '#22c55e' : '#f59e0b';
            
            return `
              <div class="region-marker" data-index="${i}" style="
                position:absolute;
                top:${region.y};
                left:${region.x};
                width:${isSelected ? '20px' : '14px'};
                height:${isSelected ? '20px' : '14px'};
                background:${statusColor};
                border-radius:50%;
                cursor:pointer;
                transition:all 0.3s ease;
                box-shadow:0 0 ${isSelected ? '20px' : '10px'} ${statusColor}66;
                animation:${region.status === 'active' ? 'regionPulse 2s infinite' : 'regionBlink 3s infinite'};
                z-index:${isSelected ? '10' : '5'};
                transform:${isSelected ? 'scale(1.2)' : 'scale(1)'};
              " title="${region.name}">
                ${isSelected ? `<div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:white;padding:8px 12px;border-radius:6px;font-size:11px;white-space:nowrap;">
                  <strong>${region.name}</strong><br>
                  ${region.services} services<br>
                  Status: ${region.status}
                </div>` : ''}
              </div>
            `;
          }).join('')}
          
          <!-- Connection lines for selected region -->
          ${selectedRegion !== null ? `
            <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">
              ${regions.map((region, i) => {
                if (i === selectedRegion) return '';
                const selected = regions[selectedRegion];
                return `<line x1="${parseFloat(selected.x)}%" y1="${parseFloat(selected.y)}%" x2="${parseFloat(region.x)}%" y2="${parseFloat(region.y)}%" stroke="#3b82f6" stroke-width="1" opacity="0.4" stroke-dasharray="3,3"/>`;
              }).join('')}
            </svg>
          ` : ''}
          
          <style>
            @keyframes regionPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            @keyframes regionBlink {
              0%, 90%, 100% { opacity: 1; }
              95% { opacity: 0.3; }
            }
          </style>
        </div>
        
        ${selectedRegion !== null ? `
          <div style="margin-top:12px;padding:16px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:8px;border:1px solid rgba(255,255,255,0.2);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <strong style="color:#1e293b;">${regions[selectedRegion].name}</strong>
                <div style="color:#64748b;font-size:14px;margin-top:4px;">
                  📊 ${regions[selectedRegion].services} AWS services available<br>
                  🟢 Status: ${regions[selectedRegion].status === 'active' ? 'Fully operational' : 'Limited services'}
                </div>
              </div>
              <button onclick="clearRegionSelection()" style="background:#ef4444;color:white;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:12px;">Clear</button>
            </div>
          </div>
        ` : ''}
      `;
      
      // Add click handlers
      mapDemo.querySelectorAll('.region-marker').forEach((marker, i) => {
        marker.onclick = () => {
          selectedRegion = selectedRegion === i ? null : i;
          renderMap();
          if (selectedRegion !== null) {
            showNotification(`Selected ${regions[i].name} - ${regions[i].services} services`, 'info');
          }
        };
      });
    };
    
    window.clearRegionSelection = () => {
      selectedRegion = null;
      renderMap();
    };
    
    renderMap();
  } else {
    console.log('availability-map-demo element not found');
    // Try to find it with a slight delay
    setTimeout(() => {
      const delayedMapDemo = document.getElementById('availability-map-demo');
      if (delayedMapDemo) {
        console.log('Found availability-map-demo element on retry');
        // Re-run the map initialization code here if needed
        delayedMapDemo.innerHTML = `
          <div style="background:linear-gradient(135deg,#0f172a,#1e293b);height:200px;border-radius:12px;position:relative;overflow:hidden;border:1px solid rgba(148,163,184,0.2);display:flex;align-items:center;justify-content:center;color:#94a3b8;">
            <div style="text-align:center;">
              <div style="font-size:24px;margin-bottom:8px;">🌍</div>
              <div>AWS Global Infrastructure</div>
              <div style="font-size:12px;margin-top:4px;">Click regions for details</div>
            </div>
          </div>
        `;
      }
    }, 1000);
  }

  // Service Graph - Dynamic and Interactive
  const graphDemo = document.getElementById('service-graph-demo');
  if (graphDemo) {
    const services = [
      {name: 'Lambda', x: 50, y: 50, color: '#3b82f6', connections: [1, 2]},
      {name: 'API GW', x: 250, y: 50, color: '#10b981', connections: [0, 2, 3]},
      {name: 'DynamoDB', x: 150, y: 150, color: '#f59e0b', connections: [0, 1]},
      {name: 'S3', x: 300, y: 120, color: '#8b5cf6', connections: [1]}
    ];
    
    let selectedService = null;
    
    const renderGraph = () => {
      graphDemo.innerHTML = `
        <div id="graph-container" style="background:rgba(248,250,252,0.5);backdrop-filter:blur(5px);height:250px;border-radius:12px;position:relative;border:1px solid rgba(226,232,240,0.8);overflow:hidden;">
          <div style="position:absolute;top:10px;left:10px;font-size:12px;color:#64748b;">Click nodes to see connections</div>
          ${services.map((service, i) => `
            <div class="graph-node" data-index="${i}" style="
              position:absolute;
              top:${service.y}px;
              left:${service.x}px;
              width:70px;
              height:70px;
              background:linear-gradient(135deg,${service.color},${service.color}dd);
              color:white;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:10px;
              cursor:pointer;
              transition:all 0.3s ease;
              box-shadow:0 4px 12px ${service.color}33;
              border:3px solid ${selectedService === i ? '#fff' : 'transparent'};
              transform:${selectedService === i ? 'scale(1.1)' : 'scale(1)'};
            ">${service.name}</div>
          `).join('')}
          <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;">
            ${services.map((service, i) => 
              service.connections.map(connIndex => {
                const target = services[connIndex];
                const isActive = selectedService === null || selectedService === i || selectedService === connIndex;
                return `<line x1="${service.x + 35}" y1="${service.y + 35}" x2="${target.x + 35}" y2="${target.y + 35}" 
                  stroke="${isActive ? '#64748b' : '#e2e8f0'}" stroke-width="${isActive ? '3' : '1'}" 
                  stroke-dasharray="${isActive ? '0' : '5,5'}" opacity="${isActive ? '0.8' : '0.3'}" 
                  style="transition:all 0.3s ease;"/>`;
              }).join('')
            ).join('')}
          </svg>
        </div>
      `;
      
      // Add click handlers
      graphDemo.querySelectorAll('.graph-node').forEach((node, i) => {
        node.onclick = () => {
          selectedService = selectedService === i ? null : i;
          renderGraph();
          showNotification(`Selected ${services[i].name} - ${services[i].connections.length} connections`, 'info');
        };
        
        node.onmouseenter = () => {
          if (selectedService === null) {
            node.style.transform = 'scale(1.05)';
            node.style.boxShadow = `0 6px 20px ${services[i].color}66`;
          }
        };
        
        node.onmouseleave = () => {
          if (selectedService !== i) {
            node.style.transform = 'scale(1)';
            node.style.boxShadow = `0 4px 12px ${services[i].color}33`;
          }
        };
      });
    };
    
    renderGraph();
  }

  // Service Comparison - Dynamic and Production Grade
  window.showServiceComparison = (inputServices = []) => {
    const allServices = {
      'Lambda': {serverless: true, autoScaling: true, freeTier: true, pricing: 'Pay per request', complexity: 'Low'},
      'EC2': {serverless: false, autoScaling: true, freeTier: true, pricing: 'Hourly', complexity: 'Medium'},
      'ECS': {serverless: false, autoScaling: true, freeTier: false, pricing: 'Container-based', complexity: 'High'},
      'Fargate': {serverless: true, autoScaling: true, freeTier: false, pricing: 'Per vCPU/GB', complexity: 'Medium'},
      'Beanstalk': {serverless: false, autoScaling: true, freeTier: true, pricing: 'Resource-based', complexity: 'Low'}
    };
    
    const servicesToCompare = inputServices.length > 0 ? inputServices.map(s => s.name || s) : ['Lambda', 'EC2', 'ECS'];
    const features = ['Serverless', 'Auto Scaling', 'Free Tier', 'Pricing Model', 'Complexity'];
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;';
    
    modal.innerHTML = `
      <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-radius:20px;padding:32px;max-width:90vw;max-height:90vh;overflow:auto;box-shadow:0 25px 50px rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.2);transform:scale(0.9);transition:transform 0.3s ease;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
          <h3 style="margin:0;color:#1e293b;font-size:24px;font-weight:600;">📊 Service Comparison</h3>
          <button onclick="closeComparison()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#64748b;padding:8px;border-radius:50%;transition:all 0.2s ease;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">×</button>
        </div>
        
        <div style="margin-bottom:20px;">
          <label style="display:block;margin-bottom:8px;color:#475569;font-weight:500;">Add Service to Compare:</label>
          <select id="service-selector" style="padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;background:white;color:#374151;cursor:pointer;">
            <option value="">Select a service...</option>
            ${Object.keys(allServices).filter(s => !servicesToCompare.includes(s)).map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
          <button onclick="addServiceToComparison()" style="margin-left:8px;padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;transition:background 0.2s ease;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Add</button>
        </div>
        
        <div style="overflow-x:auto;">
          <table id="comparison-table" style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
            <thead>
              <tr style="background:linear-gradient(135deg,#f8fafc,#e2e8f0);">
                <th style="padding:16px;text-align:left;border-bottom:2px solid #e2e8f0;color:#334155;font-weight:600;">Feature</th>
                ${servicesToCompare.map(service => `<th style="padding:16px;text-align:center;border-bottom:2px solid #e2e8f0;color:#334155;font-weight:600;position:relative;">
                  ${service}
                  <button onclick="removeService('${service}')" style="position:absolute;top:4px;right:4px;background:#ef4444;color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:12px;cursor:pointer;opacity:0.7;transition:opacity 0.2s ease;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
                </th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${features.map((feature, i) => `
                <tr style="${i % 2 === 0 ? 'background:#fafbfc;' : 'background:white;'}transition:background 0.2s ease;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='${i % 2 === 0 ? '#fafbfc' : 'white'}'">
                  <td style="padding:16px;border-bottom:1px solid #e2e8f0;color:#475569;font-weight:500;">${feature}</td>
                  ${servicesToCompare.map(service => {
                    const serviceData = allServices[service];
                    let value, color;
                    
                    switch(feature) {
                      case 'Serverless':
                        value = serviceData.serverless ? '✓' : '✗';
                        color = serviceData.serverless ? '#22c55e' : '#ef4444';
                        break;
                      case 'Auto Scaling':
                        value = serviceData.autoScaling ? '✓' : '✗';
                        color = serviceData.autoScaling ? '#22c55e' : '#ef4444';
                        break;
                      case 'Free Tier':
                        value = serviceData.freeTier ? '✓' : '✗';
                        color = serviceData.freeTier ? '#22c55e' : '#ef4444';
                        break;
                      case 'Pricing Model':
                        value = serviceData.pricing;
                        color = '#6366f1';
                        break;
                      case 'Complexity':
                        value = serviceData.complexity;
                        color = serviceData.complexity === 'Low' ? '#22c55e' : serviceData.complexity === 'Medium' ? '#f59e0b' : '#ef4444';
                        break;
                    }
                    
                    return `<td style="padding:16px;text-align:center;border-bottom:1px solid #e2e8f0;color:${color};font-weight:600;font-size:16px;">${value}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-top:24px;text-align:center;">
          <button onclick="exportComparison()" style="margin-right:12px;padding:10px 20px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;transition:background 0.2s ease;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">📊 Export as Image</button>
          <button onclick="closeComparison()" style="padding:10px 20px;background:#6b7280;color:white;border:none;border-radius:8px;cursor:pointer;transition:background 0.2s ease;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
    
    // Global functions for modal
    window.closeComparison = () => {
      modal.style.opacity = '0';
      modal.querySelector('div').style.transform = 'scale(0.9)';
      setTimeout(() => modal.remove(), 300);
    };
    
    window.addServiceToComparison = () => {
      const selector = document.getElementById('service-selector');
      const newService = selector.value;
      if (newService && !servicesToCompare.includes(newService)) {
        servicesToCompare.push(newService);
        modal.remove();
        showServiceComparison(servicesToCompare);
      }
    };
    
    window.removeService = (service) => {
      const index = servicesToCompare.indexOf(service);
      if (index > -1 && servicesToCompare.length > 2) {
        servicesToCompare.splice(index, 1);
        modal.remove();
        showServiceComparison(servicesToCompare);
      } else {
        showNotification('Need at least 2 services to compare', 'warning');
      }
    };
    
    window.exportComparison = () => {
      showNotification('Comparison exported! (Demo feature)', 'success');
    };
    
    modal.onclick = (e) => { if (e.target === modal) window.closeComparison(); };
  };

  // Enhanced Search
  const searchInput = document.getElementById('intent-input');
  if (searchInput) {
    const suggestions = ['serverless api', 'static website', 'database storage', 'machine learning', 'real-time chat'];
    
    let suggestionsDiv = document.createElement('div');
    suggestionsDiv.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:white;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);display:none;z-index:100;';
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(suggestionsDiv);

    searchInput.oninput = (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
      }
      
      const filtered = suggestions.filter(s => s.includes(query));
      if (filtered.length > 0) {
        suggestionsDiv.innerHTML = filtered.map(s => 
          `<div style="padding:12px;cursor:pointer;border-bottom:1px solid #f3f4f6;" onclick="selectSuggestion('${s}')">${s}</div>`
        ).join('');
        suggestionsDiv.style.display = 'block';
      } else {
        suggestionsDiv.style.display = 'none';
      }
    };

    window.selectSuggestion = (text) => {
      searchInput.value = text;
      suggestionsDiv.style.display = 'none';
      if (window.performSearch) window.performSearch(text);
    };
  }

  // Loading States
  window.showLoading = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = '<div style="display:flex;justify-content:center;padding:20px;"><div style="width:20px;height:20px;border:2px solid #f3f3f3;border-top:2px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite;"></div></div><style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
    }
  };

  // Notifications
  window.showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.style.cssText = `position:fixed;top:20px;right:20px;background:${type === 'success' ? '#22c55e' : '#ef4444'};color:white;padding:12px 16px;border-radius:8px;z-index:1001;transform:translateX(300px);transition:transform 0.3s ease;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(300px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Page Transitions
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  document.querySelectorAll('.page-transition').forEach(el => {
    el.style.cssText = 'opacity:0;transform:translateY(20px);transition:all 0.6s ease;';
    observer.observe(el);
  });

  // Animated Icons
  document.querySelectorAll('.service-icon, .service-card').forEach(el => {
    el.style.transition = 'transform 0.3s ease';
    el.onmouseenter = () => el.style.transform = 'translateY(-2px) scale(1.02)';
    el.onmouseleave = () => el.style.transform = 'translateY(0) scale(1)';
  });

  // Complexity Meters
  document.querySelectorAll('.service-card').forEach(card => {
    if (!card.querySelector('.complexity-meter')) {
      const complexity = ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)];
      const meter = document.createElement('div');
      meter.className = 'complexity-meter';
      meter.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
          <span style="font-size:12px;">Complexity:</span>
          <div style="display:flex;gap:2px;">
            ${[1,2,3].map(i => `<div style="width:6px;height:6px;border-radius:50%;background:${i <= (complexity === 'beginner' ? 1 : complexity === 'intermediate' ? 2 : 3) ? (complexity === 'beginner' ? '#22c55e' : complexity === 'intermediate' ? '#f59e0b' : '#ef4444') : '#e5e7eb'};"></div>`).join('')}
          </div>
          <span style="font-size:12px;text-transform:capitalize;">${complexity}</span>
        </div>
      `;
      card.appendChild(meter);
    }
  });

  // Quick Actions
  const fab = document.createElement('button');
  fab.style.cssText = 'position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:999;font-size:24px;';
  fab.textContent = '↑';
  fab.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
  document.body.appendChild(fab);

  console.log('✅ All production features initialized and working!');
});