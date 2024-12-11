-- CreateEnum
CREATE TYPE "ApplicantOfferStatus" AS ENUM ('Incomplete', 'In_Progress', 'Completed');

-- CreateEnum
CREATE TYPE "ApplicantFollowUpEmails" AS ENUM ('Not_Applicable', 'First_Follow_Up', 'Second_Follow_Up');

-- CreateEnum
CREATE TYPE "ApplicantResponse" AS ENUM ('Still_Interested', 'Not_Interested', 'Action_Required');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "resume" TEXT NOT NULL,
    "position" TEXT[],
    "platform" TEXT[],
    "coverLetter" TEXT,
    "notes" TEXT,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interviewDate" TIMESTAMP(3),
    "interviewTime" TIMESTAMP(3),
    "offerDate" TIMESTAMP(3),
    "availabilityDate" TIMESTAMP(3),
    "lastFollowUpDate" TIMESTAMP(3),
    "offerStatus" "ApplicantOfferStatus" NOT NULL DEFAULT 'Incomplete',
    "followUpEmails" "ApplicantFollowUpEmails" NOT NULL DEFAULT 'Not_Applicable',
    "response" "ApplicantResponse",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
