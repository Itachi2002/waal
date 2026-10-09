import { prisma } from "@/lib/db";
import {
  validateStreams,
  type StreamInput,
} from "@/lib/validation/streams";
import { ConflictError } from "@/lib/validation/primitives";

export async function getStreams(projectId: string) {
  return prisma.projectMaterialStream.findMany({
    where: { projectId },
    orderBy: { streamCode: "asc" },
  });
}

export async function saveStreams(
  projectId: string,
  streams: StreamInput[],
  revisions?: Record<string, number>,
) {
  const { normalized } = validateStreams(streams);

  return prisma.$transaction(async (tx) => {
    const results = [];
    for (const s of normalized) {
      const existing = await tx.projectMaterialStream.findUnique({
        where: {
          projectId_streamCode: { projectId, streamCode: s.streamCode },
        },
      });
      if (!existing) throw new Error(`Stroom ${s.streamCode} ontbreekt.`);
      if (
        revisions &&
        revisions[s.streamCode] != null &&
        existing.revision !== revisions[s.streamCode]
      ) {
        throw new ConflictError();
      }
      // A02: bij Nee details behouden (we schrijven wat de gebruiker stuurt, inclusief bestaande details)
      results.push(
        await tx.projectMaterialStream.update({
          where: { id: existing.id },
          data: {
            occurs: s.occurs,
            constructionPhase: s.constructionPhase,
            quantity: s.quantity,
            unit: s.unit,
            causeCode: s.causeCode,
            nextRoute: s.nextRoute,
            revision: { increment: 1 },
          },
        }),
      );
    }
    return results;
  });
}

export async function applyRouteToStream(
  projectId: string,
  streamId: string,
  route: string,
  expectedRevision?: number,
) {
  const stream = await prisma.projectMaterialStream.findFirst({
    where: { id: streamId, projectId },
  });
  if (!stream) throw new Error("Stroom niet gevonden.");
  if (
    expectedRevision != null &&
    stream.revision !== expectedRevision
  ) {
    throw new ConflictError();
  }
  return prisma.projectMaterialStream.update({
    where: { id: streamId },
    data: { nextRoute: route, revision: { increment: 1 } },
  });
}
