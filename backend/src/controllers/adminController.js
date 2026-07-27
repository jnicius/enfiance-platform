const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    const users = await prisma.user.count();

    const wallets = await prisma.wallet.count();

    const transactions =
      await prisma.transactionHistory.count();

    const pendingRequests =
      await prisma.paymentRequest.count({
        where: {
          status: "pending",
        },
      });

    const balances =
      await prisma.user.findMany({
        select: {
          balance: true,
        },
      });

    const totalBalance =
      balances.reduce(
        (sum, user) =>
          sum + Number(user.balance || 0),
        0
      );

    res.json({
      users,
      wallets,
      transactions,
      pendingRequests,
      totalBalance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load admin statistics",
    });
  }
};


exports.getTransactions = async (req, res) => {
  try {
    const transactions =
      await prisma.transactionHistory.findMany({
        orderBy: {
          created_at: "desc",
        },
        take: 20,
      });

    res.json(transactions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load transactions",
    });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users =
      await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
          createdAt: true,
          wallet: {
            select: {
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load users",
    });
  }
};


exports.getPendingRequests = async (req, res) => {
  try {

    const requests =
      await prisma.paymentRequest.findMany({
        where: {
          status: "pending",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(requests);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to load requests",
    });

  }
};
