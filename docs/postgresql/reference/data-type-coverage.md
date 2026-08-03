---
id: reference-data-type-coverage
title: "PostgreSQL 18 Data Type Coverage Audit"
---

# PostgreSQL 18 Data Type Coverage Audit

Authority: PostgreSQL 18 **Data Types** documentation. This map distinguishes SQL type concepts from PostgreSQL-specific built-ins and specialized internal/polymorphic types.

| Type/category | Examples / exact built-ins | Coverage | Depth |
| --- | --- | --- | --- |
| Exact integers | `smallint`, `integer`, `bigint` | 09–10 | Core |
| Exact decimals | `decimal`, `numeric` | 09–10 | Core |
| Approximate numeric | `real`, `double precision` | 09–10 | Core |
| Serial pseudo-types | `smallserial`, `serial`, `bigserial` | 10, 41 | Core + legacy guidance |
| Identity | `GENERATED ... AS IDENTITY` over integer types | 08, 10, 41 | Core / preferred modern ID DDL |
| Monetary | `money` | 18 | Reference + caveats |
| Character | `character(n)`, `char(n)`, `character varying(n)`, `varchar(n)`, `text` | 09, 11 | Core |
| Binary | `bytea` | 09, 18 | Core |
| Date/time | `date`, `time`, `time with time zone`, `timestamp`, `timestamp with time zone`, `interval` | 09, 13 | Deep |
| Boolean | `boolean` | 09, 12 | Core |
| Enumerated | user-defined enum types | 12 | Core + migration trade-offs |
| UUID | `uuid`, PG18 `uuidv7()` generation | 14 | Deep |
| JSON | `json`, `jsonb` | 16 | Deep |
| XML | `xml` | 18 | Reference |
| Arrays | one- and multidimensional arrays of element types | 15 | Deep |
| Composite | table row types and `CREATE TYPE ... AS (...)` | 18, 38 | Core/Advanced |
| Domains | `CREATE DOMAIN` over a base type | 12 | Core |
| Range | `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange` | 17 | Deep |
| Multirange | `int4multirange`, `int8multirange`, `nummultirange`, `tsmultirange`, `tstzmultirange`, `datemultirange` | 17 | Deep |
| Geometric | `point`, `line`, `lseg`, `box`, `path`, `polygon`, `circle` | 18 | Reference |
| Network address | `inet`, `cidr`, `macaddr`, `macaddr8` | 18 | Core/Reference |
| Bit strings | `bit(n)`, `bit varying(n)` / `varbit` | 18 | Reference |
| Text search | `tsvector`, `tsquery` | 103 | Deep |
| Object identifiers | `oid` plus alias/reg types such as `regclass`, `regtype`, `regproc`, `regprocedure`, `regoper`, `regoperator`, `regconfig`, `regdictionary`, `regnamespace`, `regrole`, `regcollation` | 18, 106 | Reference / internals-aware |
| WAL position | `pg_lsn` | 18, 82, 178 | Core for operations |
| Pseudo-types | `record`, `void`, `trigger`, `event_trigger`, `cstring`, `internal`, polymorphic `any*`/`anycompatible*` families and related routine-only types | 18, 98–102 | Advanced |
| User-defined base types | extension/server-programming type definitions | 18, 98–104, 183 | Advanced |

## Design audit

The handbook teaches type choice by semantics rather than storage trivia:

- use exact decimal for money-like arithmetic rather than floating point;
- treat `timestamptz` as an instant, not a stored timezone label;
- prefer modern identity syntax over `serial` for new schemas when sequence-backed integer identity is desired;
- choose UUIDv7 vs bigint from distribution/locality/size/privacy needs;
- keep stable relational facts typed instead of burying them in JSONB;
- use arrays/ranges/network types where their operators match the domain;
- keep internal/OID/pseudo-types at reference depth unless writing extensions/server routines.

Every PostgreSQL 18 data-type category is therefore covered at a depth proportional to normal developer/DBA use.