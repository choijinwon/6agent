import type { ProjectLinks } from "@/data/projects-data";

export type ProjectLinkOverrideMap = Record<string, ProjectLinks>;

export type ImportFormat = "json" | "csv";

const STORAGE_KEY = "project-link-overrides-v1";

const REQUIRED_FIELDS = ["id", "readmeUrl", "notionUrl", "githubUrl"] as const;

interface LinkRecord extends ProjectLinks {
  id: string;
}

export function getLinkImportTemplate(format: ImportFormat): string {
  if (format === "csv") {
    return [
      "id,readmeUrl,notionUrl,githubUrl",
      "proj-001,https://github.com/org/repo/blob/main/README.md,https://notion.so/org/proj-001,https://github.com/org/repo",
      "proj-002,https://github.com/org/reco/blob/main/README.md,https://notion.so/org/proj-002,https://github.com/org/reco",
    ].join("\n");
  }

  return JSON.stringify(
    [
      {
        id: "proj-001",
        readmeUrl: "https://github.com/org/repo/blob/main/README.md",
        notionUrl: "https://notion.so/org/proj-001",
        githubUrl: "https://github.com/org/repo",
      },
      {
        id: "proj-002",
        readmeUrl: "https://github.com/org/reco/blob/main/README.md",
        notionUrl: "https://notion.so/org/proj-002",
        githubUrl: "https://github.com/org/reco",
      },
    ],
    null,
    2,
  );
}

export function parseLinkOverrides(input: string, format: ImportFormat): ProjectLinkOverrideMap {
  const rows = format === "csv" ? parseCsv(input) : parseJson(input);
  return rowsToMap(rows);
}

function parseJson(input: string): LinkRecord[] {
  const raw = JSON.parse(input) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error("JSON must be an array.");
  }

  return raw.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid row at index ${index}.`);
    }

    const record = item as Record<string, unknown>;
    for (const key of REQUIRED_FIELDS) {
      if (typeof record[key] !== "string" || !record[key]?.trim()) {
        throw new Error(`Missing required field "${key}" at index ${index}.`);
      }
    }

    return {
      id: record.id as string,
      readmeUrl: record.readmeUrl as string,
      notionUrl: record.notionUrl as string,
      githubUrl: record.githubUrl as string,
    };
  });
}

function parseCsv(input: string): LinkRecord[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV needs a header and at least one row.");
  }

  const headers = lines[0].split(",").map((cell) => cell.trim());
  const headerIndex = new Map(headers.map((key, index) => [key, index]));

  for (const key of REQUIRED_FIELDS) {
    if (!headerIndex.has(key)) {
      throw new Error(`CSV header must include "${key}".`);
    }
  }

  return lines.slice(1).map((line, rowIndex) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const get = (key: (typeof REQUIRED_FIELDS)[number]) => {
      const idx = headerIndex.get(key);
      return typeof idx === "number" ? (cells[idx] ?? "") : "";
    };

    const id = get("id");
    const readmeUrl = get("readmeUrl");
    const notionUrl = get("notionUrl");
    const githubUrl = get("githubUrl");

    if (!id || !readmeUrl || !notionUrl || !githubUrl) {
      throw new Error(`Invalid CSV row at line ${rowIndex + 2}.`);
    }

    return { id, readmeUrl, notionUrl, githubUrl };
  });
}

function rowsToMap(rows: LinkRecord[]): ProjectLinkOverrideMap {
  return rows.reduce<ProjectLinkOverrideMap>((acc, row) => {
    acc[row.id] = {
      readmeUrl: row.readmeUrl,
      notionUrl: row.notionUrl,
      githubUrl: row.githubUrl,
    };
    return acc;
  }, {});
}

export function readLinkOverridesFromStorage(): ProjectLinkOverrideMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {};
    }
    const parsed = JSON.parse(saved) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as ProjectLinkOverrideMap;
  } catch {
    return {};
  }
}

export function writeLinkOverridesToStorage(overrides: ProjectLinkOverrideMap) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function clearLinkOverridesInStorage() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
