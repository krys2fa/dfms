/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the column `authId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stationId` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `DailyReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FuelType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StationFuelType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tankerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerId` on table `Station` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'OWNER', 'ATTENDANT', 'DRIVER');

-- DropForeignKey
ALTER TABLE "DailyReport" DROP CONSTRAINT "DailyReport_stationId_fkey";

-- DropForeignKey
ALTER TABLE "StationFuelType" DROP CONSTRAINT "StationFuelType_fuelTypeId_fkey";

-- DropForeignKey
ALTER TABLE "StationFuelType" DROP CONSTRAINT "StationFuelType_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_attendantId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fuelTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_stationId_fkey";

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "createdAt",
ALTER COLUMN "ownerId" SET NOT NULL,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authId",
DROP COLUMN "createdAt",
DROP COLUMN "stationId",
ADD COLUMN     "tankerId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ATTENDANT';

-- DropTable
DROP TABLE "DailyReport";

-- DropTable
DROP TABLE "FuelType";

-- DropTable
DROP TABLE "StationFuelType";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "FuelPump" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,

    CONSTRAINT "FuelPump_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTanker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "driverId" TEXT,

    CONSTRAINT "FuelTanker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTransfer" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "initialLiters" INTEGER NOT NULL,
    "finalLiters" INTEGER NOT NULL,
    "differenceLiters" INTEGER NOT NULL DEFAULT 0,
    "tankerId" TEXT NOT NULL,
    "driverId" TEXT,
    "stationId" TEXT NOT NULL,

    CONSTRAINT "FuelTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelSale" (
    "id" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,
    "pumpId" TEXT NOT NULL,
    "liters" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FuelSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "transferId" TEXT,
    "saleId" TEXT,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FuelTanker_driverId_key" ON "FuelTanker"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_transferId_key" ON "Receipt"("transferId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_saleId_key" ON "Receipt"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tankerId_key" ON "User"("tankerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tankerId_fkey" FOREIGN KEY ("tankerId") REFERENCES "FuelTanker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelPump" ADD CONSTRAINT "FuelPump_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTanker" ADD CONSTRAINT "FuelTanker_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTransfer" ADD CONSTRAINT "FuelTransfer_tankerId_fkey" FOREIGN KEY ("tankerId") REFERENCES "FuelTanker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTransfer" ADD CONSTRAINT "FuelTransfer_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTransfer" ADD CONSTRAINT "FuelTransfer_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelSale" ADD CONSTRAINT "FuelSale_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelSale" ADD CONSTRAINT "FuelSale_pumpId_fkey" FOREIGN KEY ("pumpId") REFERENCES "FuelPump"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "FuelTransfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "FuelSale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
