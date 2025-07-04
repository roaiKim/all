export interface ActionStore<S> {
  state: S
}

export const viewType = {
  view: "view",
  page: "page",
  pageHide: "pageHide",
  category: "category",
  api: "api",
} as const
