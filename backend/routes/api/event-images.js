const express = require('express');
const { Op } = require('sequelize');

const { EventImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {

});


module.exports = router;
