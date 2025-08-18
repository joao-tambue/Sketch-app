// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    elements: i.entity({
      type: i.string(), // "rectangle", "circle", "triangle"
      x: i.number(),
      y: i.number(),
      color: i.string(),
      width: i.number().optional(),
      height: i.number().optional(),
      createdAt: i.number(),
    }),
  },
  links: {},
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
