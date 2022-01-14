//Modern web Applications have Two special Modules that are completly independent of the rest of the archeticture

//Module for the Project Configuration (config.js)
//Module for some general helper functions (helper.js)

//we will put here all the variables that should be constant and reused across the Project (variables that define some Important Data about the Application itself)
//this file will allow us to configure our Project by simply changing some of the data

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
//results per page
export const RES_PER_PAGE = 10;
export const API_KEY = '28d0d2a9-583f-42a4-970d-20a44cdde296';
export const CLOSE_MODAL_SEC = 1.5;
