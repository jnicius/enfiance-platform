const express = require('express');

const router = express.Router();

const authMiddleware =
  require('../middleware/authMiddleware');

const {
  PrismaClient
} = require('@prisma/client');

const prisma =
  new PrismaClient();


// -------------------------
// GET CONTACTS
// -------------------------

router.get(
  '/',
  authMiddleware,

  async (req, res) => {

    try {

      const contacts =
        await prisma.contact.findMany({

          where: {
            ownerId: req.user.userId,
          },

          orderBy: {
            createdAt: 'desc',
          },

          take: 10,
        });


    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to load contacts',
      });
    }
  }
);


// -------------------------
// TEST ROUTE
// -------------------------

router.get(
  '/test',
  (req, res) => {

    res.json({
      success: true,
      message:
        'Contacts route working',
    });
  }
);

module.exports = router;
