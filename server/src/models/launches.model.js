const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customers: ["ZTM", "NASA"], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true //success
};

saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchesData() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  })
}

async function existsLaunchWithId(flightNumber) {
  return await launchesDatabase.findOne({
    flightNumber
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  console.info('save launch target:', launch.target);
  const planet = await planets.findOne({
    keplerName: launch.target
  });
  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  });
};

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {  
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  console.info('aborted:', aborted);
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
}
