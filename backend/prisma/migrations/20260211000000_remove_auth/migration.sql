-- Drop indexes that reference userId
DROP INDEX IF EXISTS "Pdf_userId_idx";
DROP INDEX IF EXISTS "ScheduleEntry_userId_date_idx";

-- Recreate Pdf without userId
CREATE TABLE "Pdf_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "totalPages" INTEGER NOT NULL,
    "startPage" INTEGER NOT NULL DEFAULT 1,
    "endPage" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetEndDate" DATETIME NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "externalUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "Pdf_new" ("id","title","totalPages","startPage","endPage","startDate","targetEndDate","priority","externalUrl","createdAt","updatedAt")
SELECT "id","title","totalPages","startPage","endPage","startDate","targetEndDate","priority","externalUrl","createdAt","updatedAt"
FROM "Pdf";

DROP TABLE "Pdf";
ALTER TABLE "Pdf_new" RENAME TO "Pdf";

-- Recreate ScheduleEntry without userId
CREATE TABLE "ScheduleEntry_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pdfId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "fromPage" INTEGER NOT NULL,
    "toPage" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScheduleEntry_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "ScheduleEntry_new" ("id","pdfId","date","fromPage","toPage","status","createdAt","updatedAt")
SELECT "id","pdfId","date","fromPage","toPage","status","createdAt","updatedAt"
FROM "ScheduleEntry";

DROP TABLE "ScheduleEntry";
ALTER TABLE "ScheduleEntry_new" RENAME TO "ScheduleEntry";

-- Drop User table
DROP TABLE "User";

-- Recreate indexes
CREATE INDEX "Pdf_date_idx" ON "Pdf"("startDate");
CREATE INDEX "ScheduleEntry_date_idx" ON "ScheduleEntry"("date");
CREATE INDEX "ScheduleEntry_pdfId_idx" ON "ScheduleEntry"("pdfId");