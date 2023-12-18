import { UAParser } from "ua-parser-js";

//Generate Random for Image

export const generateRandomNumber = () => {
  let randomDecimal = Math.random();
  let randomInteger = Math.floor(randomDecimal * 11);
  return randomInteger;
};

// Check User Devices

export const checkdevice = (header) => {
  console.log(header);
  let device_id;
  const parser = new UAParser(header);
  console.log(parser);
  const checkdevice = parser.getDevice();
  if (checkdevice?.vendor !== undefined) {
    device_id = String(checkdevice?.vendor + checkdevice.model);
  } else if (parser.getBrowser().name !== undefined) {
    device_id = String(parser?.getBrowser()?.name);
  } else {
    device_id = String(parser?.getOS()?.name);
  }
  return device_id;
};
