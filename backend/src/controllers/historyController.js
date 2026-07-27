const prisma =
  require('../config/database');

async function getHistory(req, res) {

  try {

    const userId =
      req.user.userId;

    // -------------------------
    // FETCH TRANSACTIONS
    // -------------------------
    const transactions =
      await prisma.transaction.findMany({

        where: {
          userId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    // -------------------------
    // ENRICH HISTORY
    // -------------------------
    const enrichedTransactions =
      await Promise.all(

        transactions.map(
          async (tx) => {

            // -------------------------
            // FIND RECEIVER
            // -------------------------
            const receiverWallet =
              await prisma.wallet.findUnique({

                where: {
                  address:
                    tx.receiver,
                },

                include: {
                  user: true,
                },
              });

            // -------------------------
            // FIND SENDER
            // -------------------------
            const senderWallet =
              await prisma.wallet.findUnique({

                where: {
                  address:
                    tx.sender,
                },

                include: {
                  user: true,
                },
              });

            // -------------------------
            // RECEIVER INFO
            // -------------------------
            let receiverName =
              null;

            let receiverEmail =
              null;

            if (
              receiverWallet &&
              receiverWallet.user
            ) {

              const firstName =
                receiverWallet.user.firstName || '';

              const lastName =
                receiverWallet.user.lastName || '';

              const fullName =
                `${firstName} ${lastName}`.trim();

              receiverName =
                fullName || null;

              receiverEmail =
                receiverWallet.user.email || null;
            }

            // -------------------------
            // SENDER INFO
            // -------------------------
            let senderName =
              null;

            let senderEmail =
              null;

            if (
              senderWallet &&
              senderWallet.user
            ) {

              const firstName =
                senderWallet.user.firstName || '';

              const lastName =
                senderWallet.user.lastName || '';

              const fullName =
                `${firstName} ${lastName}`.trim();

              senderName =
                fullName || null;

              senderEmail =
                senderWallet.user.email || null;
            }

            return {

              ...tx,

              receiverName,
              receiverEmail,

              senderName,
              senderEmail,
            };
          }
        )
      );

    return res.json({

      success: true,

      count:
        enrichedTransactions.length,

      transactions:
        enrichedTransactions,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Failed to fetch history',
    });
  }
}

module.exports = {
  getHistory,
};
