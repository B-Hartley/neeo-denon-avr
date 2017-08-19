'use strict';
const neeoapi = require('neeo-sdk');
//Denon
const denonavr_controller = require('./denonavr_controller');

console.log('NEEO SDK');
console.log('--------');

const denonAVRTCP = neeoapi.buildDevice('Denon AVR TCP')
  .setManufacturer('Denon')
  .addAdditionalSearchToken('AVR TCP')
  .setType('AVRECEIVER')
  .enableDiscovery({headerText: 'discovering', description: 'discovering'}, denonavr_controller.discoverDenon)
  .addButton({ name: 'INPUT Sonos', label: 'Sonos' })
  .addButton({ name: 'INPUT Sky Q', label: 'Sky Q' })
  .addButton({ name: 'INPUT BluRay', label: 'BluRay' })
  .addButton({ name: 'INPUT Apple TV', label: 'Apple TV' })
  .addButton({ name: 'INPUT TV', label: 'TV' })
  .addButtonGroup('Power')
  .addButtonGroup('Volume')
  .addButtonGroup('Menu and Back')
  .addButtonGroup('Controlpad')
  .addButtonHander(denonavr_controller.onButtonPressed)
  .addTextLabel({ name: 'sourceText', label: 'Source' }, denonavr_controller.getSource)
  .addSlider({ name: 'sliderVolumeValue', label: 'VOLUME SLIDER', range: [0,70], unit: 'Vol' },
  { setter: denonavr_controller.sliderVolumeValueSet, getter: denonavr_controller.sliderVolumeValueGet })
  .registerSubscriptionFunction(denonavr_controller.registerStateUpdateCallback);

function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'simple-adapter-one',
    devices: [wemoTCP, denonAVRTCP, skyQTCP]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "Denon AVR TCP".');
  })
  .catch((error) => {
    //if there was any error, print message out to console
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

const brainIp = process.env.BRAINIP;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startSdkExample(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startSdkExample(brain);
    });
}
