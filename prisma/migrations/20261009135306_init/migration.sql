-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectNumber" TEXT,
    "scanDate" TEXT,
    "executor" TEXT,
    "planner" TEXT,
    "projectPhase" TEXT,
    "scanResponsible" TEXT NOT NULL,
    "constructionMethodType" TEXT,
    "scanVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "QuickscanDefinition" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "sortOrder" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuickscanAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "questionCode" TEXT NOT NULL,
    "status" TEXT,
    "followUpAction" TEXT,
    "responsible" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuickscanAnswer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialStreamDefinition" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "sourceRef" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProjectMaterialStream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "streamCode" TEXT NOT NULL,
    "occurs" TEXT,
    "constructionPhase" TEXT,
    "quantity" TEXT,
    "unit" TEXT,
    "causeCode" TEXT,
    "nextRoute" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ProjectMaterialStream_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "projectMaterialStreamId" TEXT,
    "materialType" TEXT,
    "condition" TEXT,
    "reusable" TEXT,
    "returnConfirmed" TEXT,
    "recyclable" TEXT,
    "finalRoute" TEXT,
    "storageLocation" TEXT,
    "followUpAction" TEXT,
    "responsible" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "MaterialAssessment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaterialAssessment_projectMaterialStreamId_fkey" FOREIGN KEY ("projectMaterialStreamId") REFERENCES "ProjectMaterialStream" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluationGroupDefinition" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "sourceRef" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EvaluationStream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "groupCode" TEXT NOT NULL,
    "actualQuantity" TEXT,
    "unit" TEXT,
    "containerChanges" INTEGER,
    "route" TEXT,
    "explanation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EvaluationStream_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "attentionStream" TEXT,
    "workedWell" TEXT,
    "didNotWork" TEXT,
    "nextProjectChange" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ProjectEvaluation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductValidation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "singletonKey" TEXT NOT NULL DEFAULT 'default',
    "testedBy" TEXT,
    "role" TEXT,
    "date" TEXT,
    "projectSituation" TEXT,
    "clarityScore" INTEGER,
    "practicalityScore" INTEGER,
    "completenessScore" INTEGER,
    "timeBurdenScore" INTEGER,
    "wouldUse" TEXT,
    "fitsWaal" TEXT,
    "keyFeedback" TEXT,
    "processedChange" TEXT,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipHash" TEXT NOT NULL,
    "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "QuickscanAnswer_projectId_questionCode_key" ON "QuickscanAnswer"("projectId", "questionCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMaterialStream_projectId_streamCode_key" ON "ProjectMaterialStream"("projectId", "streamCode");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationStream_projectId_groupCode_key" ON "EvaluationStream"("projectId", "groupCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEvaluation_projectId_key" ON "ProjectEvaluation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductValidation_singletonKey_key" ON "ProductValidation"("singletonKey");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipHash_attemptedAt_idx" ON "LoginAttempt"("ipHash", "attemptedAt");
