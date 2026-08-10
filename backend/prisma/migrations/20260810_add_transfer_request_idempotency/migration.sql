-- CreateTable
CREATE TABLE "TransferRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferRequest_userId_idx" ON "TransferRequest"("userId");

-- CreateIndex
CREATE INDEX "TransferRequest_status_idx" ON "TransferRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TransferRequest_userId_requestId_key" ON "TransferRequest"("userId", "requestId");

