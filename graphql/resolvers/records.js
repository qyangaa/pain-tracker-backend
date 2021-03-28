const fetch = require("node-fetch");
const ObjectId = require("mongoose").Types.ObjectId;
const Record = require("../../mongodbModels/record");
const LastUsed = require("../../mongodbModels/lastUsed");
const Weather = require("../../mongodbModels/weather");

const updateWeather = async (geoCoordinates, date, uid) => {
  try {
    const { lon, lat } = geoCoordinates;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER}`;
    const res = await fetch(weatherUrl);
    const raw = await res.json();
    const weather = {
      date,
      uid,
      lon,
      lat,
      main: raw.weather[0].main,
      description: raw.weather[0].description,
      temp: raw.main.temp,
      humidity: raw.main.humidity,
      pressure: raw.main.pressure,
      clouds: raw.clouds.all,
      visibility: raw.visibility,
      windSpeed: raw.wind.speed,
    };
    Weather.insertOne;
  } catch (error) {
    return error;
  }
};

exports.createRecords = async (args, req) => {
  try {
    req.uid = "605f90e2534c1c502887b1d6";
    uid = ObjectId(req.uid);

    if (args.geoCoordinates) {
      const weather = await updateWeather(args.geoCoordinates);
    }
    return true;

    const date = new Date();
    let records = args.records.filter((record) => record.selected);
    const lastUsed = { options: [], _id: uid };
    records = records.map((record) => {
      lastUsed.options.push(ObjectId(record._id));
      return {
        date,
        uid,
        optionId: ObjectId(record._id),
        categoryId: ObjectId(record.categoryId),
        duration: record.duration,
        amount: record.amount,
      };
    });
    if (lastUsed.options.length < 4) {
      lastUsed.options = lastUsed.options.concat(
        args.records
          .filter((record) => !record.selected)
          .map((record) => ObjectId(record._id))
      );
      lastUsed.options = lastUsed.options.slice(0, 4);
    }

    await Record.insertMany(records);
    await LastUsed.updateOne({ _id: uid }, lastUsed);
  } catch (error) {
    return error;
  }
};

// TODO: upload record to mongodb
