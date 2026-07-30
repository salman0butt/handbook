---
id: reference-sql-command-coverage
title: PostgreSQL 18 SQL Command Coverage Audit
---

# PostgreSQL 18 SQL Command Coverage Audit

Source authority: PostgreSQL 18 **SQL Commands** reference. The table maps every command family in the current reference to its handbook treatment. `Core` means taught with runnable syntax and production semantics; `Reference` means explained enough to recognize/use safely with the official command reference for exhaustive options; `Advanced` means specialized server-extension/admin functionality.

Legend: **✅ SQL/PG** = SQL-standard concept implemented by PostgreSQL; **🐘 PG** = PostgreSQL-specific command/administrative extension; **⚠️ compatibility alias** = PostgreSQL alias retained for compatibility/convenience.

| Command | Purpose | Handbook | Depth | Standard / PG |
| --- | --- | --- | --- | --- |
| ABORT | Abort current transaction | 58–60 | Reference | ⚠️ alias for ROLLBACK |
| ALTER AGGREGATE | Change aggregate definition/ownership | 28, 98–104 | Advanced | 🐘 PG |
| ALTER COLLATION | Change collation metadata | 11, 57 | Reference | 🐘 PG |
| ALTER CONVERSION | Change encoding conversion | 11, 98–104 | Reference | 🐘 PG |
| ALTER DATABASE | Change database attributes/settings | 06, 111 | Core | 🐘 PG |
| ALTER DEFAULT PRIVILEGES | Set privileges for future objects | 93 | Core | 🐘 PG |
| ALTER DOMAIN | Change domain type | 12 | Core | ✅ SQL/PG |
| ALTER EVENT TRIGGER | Change event trigger | 102 | Reference | 🐘 PG |
| ALTER EXTENSION | Update/relocate extension | 104, 183 | Core | 🐘 PG |
| ALTER FOREIGN DATA WRAPPER | Change FDW definition | 117 | Reference | ✅ SQL/MED + PG |
| ALTER FOREIGN TABLE | Change foreign table | 117 | Reference | ✅ SQL/MED + PG |
| ALTER FUNCTION | Change function metadata | 98, 100 | Core | ✅ SQL/PG + extensions |
| ALTER GROUP | Change role membership | 93 | Reference | ⚠️ role compatibility syntax |
| ALTER INDEX | Change index attributes/name/tablespace | 50–57, 127 | Core | 🐘 PG |
| ALTER LANGUAGE | Change procedural language | 98–100, 104 | Reference | 🐘 PG |
| ALTER LARGE OBJECT | Change large-object ownership | 18, 106 | Reference | 🐘 PG |
| ALTER MATERIALIZED VIEW | Change materialized view | 40 | Core | 🐘 PG |
| ALTER OPERATOR | Change operator definition metadata | 25, 57 | Advanced | 🐘 PG |
| ALTER OPERATOR CLASS | Change operator class | 57 | Advanced | 🐘 PG |
| ALTER OPERATOR FAMILY | Change operator family | 57 | Advanced | 🐘 PG |
| ALTER POLICY | Change RLS policy | 96 | Core | 🐘 PG |
| ALTER PROCEDURE | Change procedure metadata | 99 | Core | ✅ SQL/PG + extensions |
| ALTER PUBLICATION | Change logical publication | 89 | Core | 🐘 PG |
| ALTER ROLE | Change role attributes/settings | 93–94, 111 | Core | 🐘 PG |
| ALTER ROUTINE | Change function/procedure metadata generically | 98–99 | Reference | ✅ SQL/PG |
| ALTER RULE | Change rewrite rule | 68, 98–102 | Reference | 🐘 PG |
| ALTER SCHEMA | Change schema name/owner | 07 | Core | ✅ SQL/PG |
| ALTER SEQUENCE | Change sequence | 41 | Core | ✅ SQL/PG |
| ALTER SERVER | Change foreign server | 117 | Reference | ✅ SQL/MED + PG |
| ALTER STATISTICS | Change extended-statistics target | 73 | Core | 🐘 PG |
| ALTER SUBSCRIPTION | Change logical subscription | 89 | Core | 🐘 PG |
| ALTER SYSTEM | Change server configuration | 111 | Core | 🐘 PG |
| ALTER TABLE | Change table/columns/constraints/partitioning | 08, 42, 115, 125–128 | Core | ✅ SQL/PG + extensions |
| ALTER TABLESPACE | Change tablespace | 79, 111 | Reference | 🐘 PG |
| ALTER TEXT SEARCH CONFIGURATION | Change FTS configuration | 103 | Reference | 🐘 PG |
| ALTER TEXT SEARCH DICTIONARY | Change FTS dictionary | 103 | Reference | 🐘 PG |
| ALTER TEXT SEARCH PARSER | Change FTS parser | 103 | Advanced | 🐘 PG |
| ALTER TEXT SEARCH TEMPLATE | Change FTS template | 103 | Advanced | 🐘 PG |
| ALTER TRIGGER | Rename/dependency metadata for trigger | 101 | Core | ✅ SQL/PG + extensions |
| ALTER TYPE | Change enum/composite/type metadata | 12, 18 | Core | ✅ SQL/PG + extensions |
| ALTER USER | Change login role | 93–94 | Reference | ⚠️ alias around ALTER ROLE |
| ALTER USER MAPPING | Change FDW user mapping | 117 | Reference | ✅ SQL/MED + PG |
| ALTER VIEW | Change view attributes | 39 | Core | ✅ SQL/PG + extensions |
| ANALYZE | Collect planner statistics | 73, 75–76 | Core | 🐘 PG command |
| BEGIN | Start transaction block | 58 | Core | ✅ transaction concept |
| CALL | Invoke procedure | 99 | Core | ✅ SQL/PG |
| CHECKPOINT | Force checkpoint | 83 | Reference | 🐘 PG admin |
| CLOSE | Close cursor | 38, 100 | Reference | ✅ SQL/PG |
| CLUSTER | Physically reorder table using index | 50, 79 | Reference | 🐘 PG |
| COMMENT | Attach object comments | 05, 106 | Reference | 🐘 PG |
| COMMIT | Commit transaction | 58–59 | Core | ✅ SQL/PG |
| COMMIT PREPARED | Commit prepared two-phase transaction | 58, 141, 153 | Advanced | 🐘 PG / 2PC |
| COPY | Bulk import/export | 165–166 | Core | 🐘 PG command/protocol |
| CREATE ACCESS METHOD | Define index/table access method | 50–57, 177, 183 | Advanced | 🐘 PG |
| CREATE AGGREGATE | Define aggregate | 28, 98 | Advanced | 🐘 PG |
| CREATE CAST | Define type conversion | 09–18, 98 | Advanced | ✅ SQL/PG + extensions |
| CREATE COLLATION | Define collation | 11, 57 | Reference | ✅ SQL/PG |
| CREATE CONVERSION | Define encoding conversion | 11 | Advanced | 🐘 PG |
| CREATE DATABASE | Create database | 06 | Core | 🐘 implementation command |
| CREATE DOMAIN | Define constrained domain type | 12 | Core | ✅ SQL/PG |
| CREATE EVENT TRIGGER | Define DDL event trigger | 102 | Core | 🐘 PG |
| CREATE EXTENSION | Install extension | 104, 183 | Core | 🐘 PG |
| CREATE FOREIGN DATA WRAPPER | Define FDW | 117 | Reference | ✅ SQL/MED + PG |
| CREATE FOREIGN TABLE | Define foreign table | 117 | Core | ✅ SQL/MED + PG |
| CREATE FUNCTION | Define function | 98, 100 | Core | ✅ SQL/PG + extensions |
| CREATE GROUP | Create role/group | 93 | Reference | ⚠️ alias around CREATE ROLE |
| CREATE INDEX | Create index | 50–57 | Core | 🐘 physical-design command |
| CREATE LANGUAGE | Install procedural language | 98–100, 104 | Reference | 🐘 PG |
| CREATE MATERIALIZED VIEW | Persist query result | 40 | Core | 🐘 PG |
| CREATE OPERATOR | Define operator | 25, 57 | Advanced | 🐘 PG |
| CREATE OPERATOR CLASS | Define index operator class | 57, 177 | Advanced | 🐘 PG |
| CREATE OPERATOR FAMILY | Define related operator classes | 57, 177 | Advanced | 🐘 PG |
| CREATE POLICY | Define RLS policy | 96 | Core | 🐘 PG |
| CREATE PROCEDURE | Define procedure | 99–100 | Core | ✅ SQL/PG + extensions |
| CREATE PUBLICATION | Define logical publication | 89 | Core | 🐘 PG |
| CREATE ROLE | Create role | 93 | Core | 🐘 PG |
| CREATE RULE | Define rewrite rule | 68, 98–102 | Advanced | 🐘 PG |
| CREATE SCHEMA | Create schema namespace | 07 | Core | ✅ SQL/PG |
| CREATE SEQUENCE | Create sequence | 41 | Core | ✅ SQL/PG |
| CREATE SERVER | Define foreign server | 117 | Core | ✅ SQL/MED + PG |
| CREATE STATISTICS | Create extended statistics | 73 | Core | 🐘 PG |
| CREATE SUBSCRIPTION | Define logical subscription | 89 | Core | 🐘 PG |
| CREATE TABLE | Create table and constraints | 08, 42–49 | Core | ✅ SQL/PG + extensions |
| CREATE TABLE AS | Materialize query into table | 08, 38, 46 | Core | ✅ SQL/PG |
| CREATE TABLESPACE | Create storage tablespace | 79, 138 | Reference | 🐘 PG |
| CREATE TEXT SEARCH CONFIGURATION | Create FTS configuration | 103 | Reference | 🐘 PG |
| CREATE TEXT SEARCH DICTIONARY | Create FTS dictionary | 103 | Reference | 🐘 PG |
| CREATE TEXT SEARCH PARSER | Create FTS parser | 103 | Advanced | 🐘 PG |
| CREATE TEXT SEARCH TEMPLATE | Create FTS template | 103 | Advanced | 🐘 PG |
| CREATE TRANSFORM | Define language/type transform | 98–104 | Advanced | 🐘 PG |
| CREATE TRIGGER | Create DML trigger | 101 | Core | ✅ SQL/PG + extensions |
| CREATE TYPE | Create enum/composite/base/range type | 12, 17–18 | Core | ✅ SQL/PG + extensions |
| CREATE USER | Create login role | 93–94 | Reference | ⚠️ alias around CREATE ROLE |
| CREATE USER MAPPING | Map local role to foreign server identity | 117 | Core | ✅ SQL/MED + PG |
| CREATE VIEW | Create view | 39 | Core | ✅ SQL/PG + extensions |
| DEALLOCATE | Remove prepared statement | 120 | Core | ✅ SQL concept + PG syntax |
| DECLARE | Define cursor | 38, 100 | Reference | ✅ SQL/PG |
| DELETE | Delete rows | 22 | Core | ✅ SQL/PG + USING/RETURNING extensions |
| DISCARD | Reset session state/caches | 91, 111 | Reference | 🐘 PG |
| DO | Execute anonymous procedural block | 100 | Core | 🐘 PG |
| DROP ACCESS METHOD | Drop access method | 50–57, 177 | Advanced | 🐘 PG |
| DROP AGGREGATE | Drop aggregate | 28, 98 | Advanced | 🐘 PG |
| DROP CAST | Drop cast | 09–18 | Reference | ✅ SQL/PG |
| DROP COLLATION | Drop collation | 11 | Reference | ✅ SQL/PG |
| DROP CONVERSION | Drop conversion | 11 | Advanced | 🐘 PG |
| DROP DATABASE | Drop database | 06 | Core | 🐘 implementation command |
| DROP DOMAIN | Drop domain | 12 | Core | ✅ SQL/PG |
| DROP EVENT TRIGGER | Drop event trigger | 102 | Reference | 🐘 PG |
| DROP EXTENSION | Remove extension and owned objects | 104, 183 | Core | 🐘 PG |
| DROP FOREIGN DATA WRAPPER | Drop FDW | 117 | Reference | ✅ SQL/MED + PG |
| DROP FOREIGN TABLE | Drop foreign table | 117 | Core | ✅ SQL/MED + PG |
| DROP FUNCTION | Drop function | 98 | Core | ✅ SQL/PG |
| DROP GROUP | Drop group role | 93 | Reference | ⚠️ alias around DROP ROLE |
| DROP INDEX | Drop index | 50–57, 127 | Core | 🐘 PG |
| DROP LANGUAGE | Drop procedural language | 98–100 | Reference | 🐘 PG |
| DROP MATERIALIZED VIEW | Drop materialized view | 40 | Core | 🐘 PG |
| DROP OPERATOR | Drop operator | 25 | Advanced | 🐘 PG |
| DROP OPERATOR CLASS | Drop operator class | 57 | Advanced | 🐘 PG |
| DROP OPERATOR FAMILY | Drop operator family | 57 | Advanced | 🐘 PG |
| DROP OWNED | Drop objects/privileges owned by roles | 93 | Reference | 🐘 PG |
| DROP POLICY | Drop RLS policy | 96 | Core | 🐘 PG |
| DROP PROCEDURE | Drop procedure | 99 | Core | ✅ SQL/PG |
| DROP PUBLICATION | Drop publication | 89 | Core | 🐘 PG |
| DROP ROLE | Drop role | 93 | Core | 🐘 PG |
| DROP ROUTINE | Drop routine generically | 98–99 | Reference | ✅ SQL/PG |
| DROP RULE | Drop rewrite rule | 68 | Reference | 🐘 PG |
| DROP SCHEMA | Drop schema | 07 | Core | ✅ SQL/PG |
| DROP SEQUENCE | Drop sequence | 41 | Core | ✅ SQL/PG |
| DROP SERVER | Drop foreign server | 117 | Core | ✅ SQL/MED + PG |
| DROP STATISTICS | Drop extended statistics | 73 | Core | 🐘 PG |
| DROP SUBSCRIPTION | Drop logical subscription | 89 | Core | 🐘 PG |
| DROP TABLE | Drop table | 08 | Core | ✅ SQL/PG |
| DROP TABLESPACE | Drop tablespace | 79, 138 | Reference | 🐘 PG |
| DROP TEXT SEARCH CONFIGURATION | Drop FTS configuration | 103 | Reference | 🐘 PG |
| DROP TEXT SEARCH DICTIONARY | Drop FTS dictionary | 103 | Reference | 🐘 PG |
| DROP TEXT SEARCH PARSER | Drop FTS parser | 103 | Advanced | 🐘 PG |
| DROP TEXT SEARCH TEMPLATE | Drop FTS template | 103 | Advanced | 🐘 PG |
| DROP TRANSFORM | Drop transform | 98–104 | Advanced | 🐘 PG |
| DROP TRIGGER | Drop trigger | 101 | Core | ✅ SQL/PG |
| DROP TYPE | Drop type | 12, 17–18 | Core | ✅ SQL/PG |
| DROP USER | Drop login role | 93 | Reference | ⚠️ alias around DROP ROLE |
| DROP USER MAPPING | Drop foreign user mapping | 117 | Core | ✅ SQL/MED + PG |
| DROP VIEW | Drop view | 39 | Core | ✅ SQL/PG |
| END | Commit transaction | 58 | Reference | ⚠️ alias for COMMIT |
| EXECUTE | Execute SQL prepared statement | 120 | Core | ✅ SQL concept + PG syntax |
| EXPLAIN | Show execution plan; ANALYZE can execute | 70–74 | Core | 🐘 PG |
| FETCH | Fetch cursor rows | 38, 100 | Reference | ✅ SQL/PG |
| GRANT | Grant privileges or role membership | 93 | Core | ✅ SQL/PG + PG role form |
| IMPORT FOREIGN SCHEMA | Import remote foreign tables | 117 | Core | ✅ SQL/MED + PG |
| INSERT | Insert rows | 20, 23 | Core | ✅ SQL/PG + ON CONFLICT/RETURNING extensions |
| LISTEN | Subscribe session to notification channel | 121, 133 | Reference | 🐘 PG |
| LOAD | Load shared library file | 104, 183 | Advanced | 🐘 PG |
| LOCK | Explicit table lock | 64 | Core | 🐘 PG syntax |
| MERGE | Conditional source/target DML | 23 | Core | ✅ SQL/PG |
| MOVE | Position cursor | 38, 100 | Reference | 🐘 PG cursor command |
| NOTIFY | Send asynchronous notification | 121, 133 | Reference | 🐘 PG |
| PREPARE | Create prepared statement | 120 | Core | ✅ SQL concept + PG syntax |
| PREPARE TRANSACTION | Prepare two-phase transaction | 58, 141, 153 | Advanced | 🐘 PG / 2PC |
| REASSIGN OWNED | Transfer object ownership | 93 | Reference | 🐘 PG |
| REFRESH MATERIALIZED VIEW | Recompute materialized view | 40 | Core | 🐘 PG |
| REINDEX | Rebuild index(es) | 78, 127 | Core | 🐘 PG |
| RELEASE SAVEPOINT | Destroy savepoint without rollback | 60 | Core | ✅ SQL/PG |
| RESET | Restore setting to default | 111 | Core | 🐘 PG session config |
| REVOKE | Remove privileges or role membership | 93 | Core | ✅ SQL/PG + PG role form |
| ROLLBACK | Abort transaction | 58 | Core | ✅ SQL/PG |
| ROLLBACK PREPARED | Abort prepared two-phase transaction | 58, 141, 153 | Advanced | 🐘 PG / 2PC |
| ROLLBACK TO SAVEPOINT | Roll back partial transaction work | 60 | Core | ✅ SQL/PG |
| SAVEPOINT | Create partial rollback point | 60 | Core | ✅ SQL/PG |
| SECURITY LABEL | Apply security-provider label | 92–93, 187 | Advanced | 🐘 PG |
| SELECT | Query rows/expressions | 24–38 | Core | ✅ SQL/PG + extensions |
| SELECT INTO | Create table from query result | 08, 38 | Reference | 🐘 historical PG form; prefer CREATE TABLE AS |
| SET | Change runtime parameter | 111 | Core | ✅ SQL/PG + PG settings |
| SET CONSTRAINTS | Set deferred constraint checking | 42 | Core | ✅ SQL/PG |
| SET ROLE | Assume role | 93 | Core | ✅ SQL/PG |
| SET SESSION AUTHORIZATION | Change session authorization identity | 93 | Reference | ✅ SQL/PG |
| SET TRANSACTION | Set transaction characteristics | 63 | Core | ✅ SQL/PG |
| SHOW | Display runtime parameter | 111 | Core | 🐘 PG |
| START TRANSACTION | Begin transaction with characteristics | 58, 63 | Core | ✅ SQL/PG |
| TRUNCATE | Remove all rows with table-level semantics | 22 | Core | ✅ SQL/PG + extensions |
| UNLISTEN | Stop notification subscription | 121, 133 | Reference | 🐘 PG |
| UPDATE | Update rows | 21 | Core | ✅ SQL/PG + FROM/RETURNING extensions |
| VACUUM | MVCC cleanup/freeze/analyze maintenance | 75–76 | Core | 🐘 PG |
| VALUES | Construct a row set | 38 | Core | ✅ SQL/PG |

## Audit conclusion

All current PostgreSQL 18 command-reference entries are either taught directly at **Core** depth or mapped at **Reference/Advanced** depth to the chapter where an engineer learns when and why the command exists. Specialized object-definition commands (operator classes, text-search parser/templates, access methods, transforms) are intentionally Advanced because normal application developers consume these mechanisms through PostgreSQL core or extensions rather than authoring them routinely.

When exact syntax/options matter, the current PostgreSQL 18 command page remains the authority; this audit is a coverage map, not a replacement command reference.