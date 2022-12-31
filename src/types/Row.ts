export type Row = {
  name: string,
  completed: boolean,
  isVisible: boolean
  subItems?: Row[],
}