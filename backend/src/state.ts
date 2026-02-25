import { ProfileSection, SectionStatus } from "./types";

let sections: ProfileSection[] = [
  {
    id: "photo",
    title: "Your photo",
    status: "complete",
    iconName: "camera",
    photoUri: "https://picsum.photos/80",
  },
  {
    id: "contact",
    title: "Contact Details",
    status: "todo",
    iconName: "account-outline",
  },
  {
    id: "socials",
    title: "Socials & Links",
    subtitle: "Includes your personal & team sites",
    status: "todo",
    iconName: "link",
  },
  {
    id: "brokerage",
    title: "Brokerage",
    status: "todo",
    iconName: "account-group-outline",
  },
  {
    id: "branding",
    title: "Team & Branding",
    status: "todo",
    iconName: "brush",
  },
  {
    id: "bio",
    title: "Your Bio Page",
    status: "todo",
    iconName: "file-document-outline",
  },
];

function calculateCompletion(): number {
  const completed = sections.filter((s) => s.status === "complete").length;
  return Math.round((completed / sections.length) * 100);
}

export function getProfile() {
  return {
    sections: [...sections],
    completionPercentage: calculateCompletion(),
    updatedAt: new Date().toISOString(),
  };
}

export function getProgress() {
  return {
    completionPercentage: calculateCompletion(),
    updatedAt: new Date().toISOString(),
  };
}

export function updateSection(
  id: string,
  status: SectionStatus,
  data?: Record<string, unknown>,
): ProfileSection {
  const index = sections.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Section "${id}" not found`);
  }
  sections[index] = {
    ...sections[index],
    status,
    ...(data ? { data } : {}),
  };
  return sections[index];
}

export function updatePhoto(photoUri: string): ProfileSection {
  const index = sections.findIndex((s) => s.id === "photo");
  sections[index] = {
    ...sections[index],
    photoUri,
    status: "complete",
  };
  return sections[index];
}
