const prisma =
  require('../config/database');

// -------------------------
// SEARCH USERS
// -------------------------
async function searchUsers(req, res) {

  try {

    const query =
      req.query.q;

    if (!query) {

      return res.json({
        success: true,
        users: [],
      });
    }

    const users =
      await prisma.user.findMany({

        where: {

          OR: [

            {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },

            {
              username: {
                contains: query,
                mode: 'insensitive',
              },
            },

            {
              firstName: {
                contains: query,
                mode: 'insensitive',
              },
            },

            {
              lastName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        take: 8,

        select: {

          id: true,

          email: true,

          username: true,

          firstName: true,

          lastName: true,
        },
      });

    return res.json({

      success: true,

      users,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Search failed',
    });
  }
}

module.exports = {
  searchUsers,
};
