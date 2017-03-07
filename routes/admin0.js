var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();

var file = require('../db_schema/upload_details.js');
var file_nv = require('../db_schema/upload_details_nv.js');