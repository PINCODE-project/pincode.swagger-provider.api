/*
  Warnings:

  - Made the column `project_id` on table `microservice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workspace_id` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `snippet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workspace_id` on table `snippet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `workspace_member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "microservice" ALTER COLUMN "project_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "workspace_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "snippet" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "workspace_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "workspace_member" ALTER COLUMN "user_id" SET NOT NULL;
