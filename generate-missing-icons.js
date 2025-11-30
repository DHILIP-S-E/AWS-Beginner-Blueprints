const fs = require('fs');
const path = require('path');

// List of all services that need icons
const missingIcons = [
  'application-discovery', 'application-migration', 'iot-analytics', 'iot-device-management',
  'iot-events', 'iot-sitewise', 'iot-things-graph', 'iot-greengrass', 'iot-device-defender',
  'iot-1-click', 'robomaker', 'ground-station', 'outposts', 'mediaconnect', 'mediaconvert',
  'mediapackage', 'mediastore', 'mediatailor', 'ivs', 'nimble-studio', 'kinesis-video-streams',
  'managed-grafana', 'managed-prometheus', 'proton', 'codestar', 'codecommit', 'codedeploy',
  'cloud9', 'device-farm', 'fault-injection-simulator', 'chatbot', 'license-manager',
  'service-catalog', 'opsworks', 'elastic-beanstalk', 'app-runner', 'wavelength', 'local-zones',
  'snow-family', 'snowcone', 'snowmobile', 'marketplace', 'partner-central', 'iq', 're-post',
  'training', 'activate', 'educate', 'credits', 'health', 'compute-optimizer', 'resource-groups',
  'tag-editor', 'application-composer', 'sam', 'cdk', 'copilot', 'cli', 'sdk', 'tools-powershell',
  'console-mobile'
];

// Generic icon template
const createIcon = (name) => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="4" fill="#FF9900"/>
<rect x="6" y="8" width="12" height="8" rx="1" fill="white"/>
<circle cx="9" cy="11" r="1" fill="#FF9900"/>
<circle cx="15" cy="13" r="1" fill="#FF9900"/>
<path d="M8 14h8" stroke="#FF9900" stroke-width="1"/>
</svg>`;

// Create all missing icons
missingIcons.forEach(iconName => {
  const iconPath = path.join(__dirname, 'assets', 'icons', `${iconName}.svg`);
  if (!fs.existsSync(iconPath)) {
    fs.writeFileSync(iconPath, createIcon(iconName));
    console.log(`Created ${iconName}.svg`);
  }
});

console.log('All missing icons created!');