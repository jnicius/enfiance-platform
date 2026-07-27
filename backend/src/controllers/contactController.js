const prisma =
  require('../config/database');

// -------------------------
// GET RECENT CONTACTS
// -------------------------
async function getContacts(req, res) {

  try {

    const userId =
      req.user.userId;

    const contacts =
      await prisma.contact.findMany({

        where: {
          ownerId: userId,
        },

        orderBy: {
          createdAt: 'desc',
        },

        take: 8,
      });

    return res.json({

      success: true,

      contacts,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Failed to fetch contacts',
    });
  }
}

module.exports = {
  getContacts,
};
