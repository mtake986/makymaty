export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export const TRAINING_PARTS = [
  { value: "abs", label: "Abs" },
  { value: "arms", label: "Arms" },
  { value: "biceps", label: "Biceps" },
  { value: "back", label: "Back" },
  { value: "chest", label: "Chest" },
  { value: "glute", label: "Glute" },
  { value: "ham", label: "Ham" },
  { value: "legs", label: "Legs" },
  { value: "quads", label: "Quads" },
  { value: "shoulders", label: "Shoulders" },
  { value: "triceps", label: "Triceps" },
];

export const DEFAULT_VALUE_ANOTHER_TRAINING_PARTS = ["chest"]