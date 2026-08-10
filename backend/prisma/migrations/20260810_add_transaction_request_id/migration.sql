-- AlterTable
ALTER TABLE "TransactionHistory" ADD COLUMN     "requestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_requestId_key" ON "TransactionHistory"("requestId");

