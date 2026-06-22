/*
  Warnings:

  - You are about to drop the `booking_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_comments" DROP CONSTRAINT "booking_comments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_comments" DROP CONSTRAINT "booking_comments_user_id_fkey";

-- DropTable
DROP TABLE "booking_comments";
