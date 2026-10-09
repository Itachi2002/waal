# Datamodel

Relationele opslag via Prisma + SQLite. Stabiele broncodes als sleutels; null = onbeantwoord. Bewerkbare hoofdrecords: `id`, `createdAt`, `updatedAt`, `revision`.

## Entiteiten

### Project
R01-velden: `name`, `projectNumber`, `scanDate` (date-only string), `executor`, `planner`, `projectPhase`, `scanResponsible`, `constructionMethodType`, `scanVersion` + metadata.

### QuickscanDefinition (seed, read-only)
`code` Q01–Q10, `sortOrder`, `subject`, `question`, `sourceRef`.

### QuickscanAnswer
Uniek `(projectId, questionCode)`. `status` null | YES | NO | NA. `followUpAction`, `responsible` nullable.

### MaterialStreamDefinition (seed)
`code` M01–M17, `label`, `examples`, `sortOrder`, `sourceRef`.

### ProjectMaterialStream
Uniek `(projectId, streamCode)`. `occurs`, `constructionPhase`, `quantity` (Decimal string), `unit`, `causeCode`, `nextRoute`.

### MaterialAssessment
`projectId`, optioneel `projectMaterialStreamId` (zelfde project), conditie/hergebruik/retour/recycling, `finalRoute` nullable, opslag/actie/verantwoordelijke.

### EvaluationGroupDefinition (seed)
E01–E08.

### EvaluationStream
Uniek `(projectId, groupCode)`. Hoeveelheid, eenheid, containerwissels, route, toelichting.

### ProjectEvaluation
Uniek `projectId`. Vier nullable tekstvelden (leerpunten).

### ProductValidation
Singleton (`singletonKey = "default"`). R06-velden; scores nullable 1–5.

### User / Session
Lokale admin (A11). Opaque sessie-tokens.

## Routecodes per context

| Code | Stromen | Assessment | Evaluatie |
|---|---|---|---|
| REUSE | ja | ja | ja (label Hergebruik) |
| RETURN | ja | ja | ja (label Retour) |
| RECYCLE | ja | ja | ja |
| SPECIFIC | ja | ja | ja |
| RESIDUAL | ja (BSA / restafval) | ja (BSA / restafval) | ja (BSA) |
| NEEDS_ASSESSMENT | ja alleen | nee | nee |
| MULTIPLE | nee | nee | ja alleen |

Leeg/null is geen routecode.

## Geen tabellen voor

Prijzen, CO₂, leveranciers, container-assets, werknemersdirectory, goedkeuringen, notificaties.
EOF
