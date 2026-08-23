# Database Backup & Export Strategy
## Clinote Clinical Intelligence Platform

This document outlines the backup, export, and disaster recovery strategies for the Clinote production database (PostgreSQL on Supabase) and object storage.

---

## 💾 1. PostgreSQL Database Backups

Supabase manages PostgreSQL database backups automatically. However, we have configured a dual-layer strategy: **Automated Platform Backups** and **Ad-hoc Logical Backups**.

### A. Automated Platform Backups (Supabase Native)
* **Point-in-Time Recovery (PITR)**: Enabled on the production tier. Allows database state restoration down to the second (up to 7 days retention).
* **Daily Physical Backups**: Automated daily full backups are captured and stored in a secure, encrypted offline storage bucket. Retention is based on project tier:
  * **Free/Pro**: 7 days retention.
  * **Enterprise**: 30 days retention.

### B. Ad-hoc Logical Backups (CLI/Scripts)
For offline local backups, migrations, or local development seeding, use `pg_dump` to generate a logical SQL dump:

```bash
# Export schema only
pg_dump --host=db.zflcdygupcpcxukrycyi.supabase.co --port=5432 --username=postgres --dbname=postgres --schema-only > database/sql/schema_backup.sql

# Export entire database (schema + data)
pg_dump --host=db.zflcdygupcpcxukrycyi.supabase.co --port=5432 --username=postgres --dbname=postgres --clean --if-exists > database/sql/full_backup.sql
```

---

## 🪣 2. Object Storage Syncing & Exports

The Clinote platform stores critical medical documents (admission sheets, reports, voice notes) in Supabase Storage buckets. These buckets are backed up and sync-replicated.

### A. Storage Replication (Local Copying)
Using the Supabase CLI or direct S3-compatible API access, sync clinical storage assets to an encrypted local vault or AWS S3 Glacier storage once daily:

```bash
# Sync local backups directory with Supabase clinical-report bucket
aws s3 sync s3://zflcdygupcpcxukrycyi/clinical-report ./backups/storage/clinical-report/
```

### B. Disaster Recovery RTO/RPO Metrics
* **Recovery Point Objective (RPO)**:
  * **Database**: < 5 minutes (via PITR log shipping).
  * **Storage**: < 24 hours (via daily sync scripts).
* **Recovery Time Objective (RTO)**:
  * **Database Restore**: < 30 minutes.
  * **Storage Mount**: < 1 hour.
