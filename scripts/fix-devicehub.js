const fs = require('fs');
const f = 'node_modules/@react-native-community/cli-platform-apple/build/commands/runCommand/runOnSimulator.js';
let s = fs.readFileSync(f, 'utf8');
const old = "_child_process().default.execFileSync('open', [`${activeDeveloperDir}/Applications/Simulator.app`, '--args', '-CurrentDeviceUDID', simulator.udid]);";
if (s.includes('DeviceHub.app')) { console.log('DeviceHub fix: already applied'); process.exit(0); }
if (!s.includes(old)) { console.error('DeviceHub fix: expected line not found - CLI version differs'); process.exit(0); }
s = s.replace(old, `// Xcode 27+: Simulator.app replaced by DeviceHub.app (backport of cli#2806)
  const simulatorApp = \`\${activeDeveloperDir}/Applications/Simulator.app\`;
  const deviceHubApp = \`\${activeDeveloperDir}/../Applications/DeviceHub.app\`;
  if (require('fs').existsSync(simulatorApp)) {
    _child_process().default.execFileSync('open', [simulatorApp, '--args', '-CurrentDeviceUDID', simulator.udid]);
  } else if (require('fs').existsSync(deviceHubApp)) {
    _child_process().default.execFileSync('open', [\`devices://device/open?id=\${simulator.udid}\`]);
  }`);
fs.writeFileSync(f, s);
console.log('DeviceHub fix: applied');
