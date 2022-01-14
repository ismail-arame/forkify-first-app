//Contain functions that we reuse multiple times Across our Project
// import { async } from 'regenerator-runtime';
import icons from 'url:../img/icons.svg'; //Parcel 2
import { TIMEOUT_SEC } from './config.js';

const timeout = async function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too Long , Timeout ${s} !`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    // race between timeout and fetch function (whatever occurs first win race)
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status}) :)`);

    //This data will be the resolved value of the Promise returned by getJSON function
    return data;
  } catch (err) {
    //(Important Note) : => Propagating Error from helper.js to model.js
    //the module that will export that getJSON func is the one that will handle that error (model Module)
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      //headers are snippit of text which are like information about the request itself
      headers: {
        //and so with this we tell the API that the data we'll send is in Json Format so our API can correctly accept our data and create a new recipe in the database
        'Content-Type': 'application/json',
      },
      //the Payload of the request => the data that we want to send
      body: JSON.stringify(uploadData),
    });
    // race between timeout and fetch function (whatever occurs first win race)
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status}) :)`);

    //This data will be the resolved value of the Promise returned by getJSON function
    return data;
  } catch (err) {
    //(Important Note) : => Propagating Error from helper.js to model.js
    //the module that will export that getJSON func is the one that will handle that error (model Module)
    throw err;
  }
};

//If we want to refactor it and make it look NICER

/*
//if uploadData exist         ===> sendJSON function
//if uploadData doesn't exist ===> getJSON function
//ALL in ONE function called AJAX
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          //headers are snippit of text which are like information about the request itself
          headers: {
            //and so with this we tell the API that the data we'll send is in Json Format so our API can correctly accept our data and create a new recipe in the database
            'Content-Type': 'application/json',
          },
          //the Payload of the request => the data that we want to send
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // race between timeout and fetch function (whatever occurs first win race)
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status}) :)`);

    //This data will be the resolved value of the Promise returned by getJSON function
    return data;
  } catch (err) {
    //(Important Note) : => Propagating Error from helper.js to model.js
    //the module that will export that getJSON func is the one that will handle that error (model Module)
    throw err;
  }
};
*/
