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

    messages: i.entity({
      user: i.string(), // nome do usuário
      text: i.string(), // mensagem
      createdAt: i.number(), // timestamp
      editedAt: i.number().optional(), // quando foi editada
      deleted: i.boolean().optional(), // mensagem apagada (soft delete)
    }),

    presence: i.entity({
      user: i.string(), // nome do usuário
      typing: i.boolean(), // está digitando ou não
      online: i.boolean().optional(), // opcional, mas útil para mostrar "online agora"
      lastActive: i.number().optional(), // timestamp do último update
    }),
  },
  links: {},
  rooms: {},
});

// Helps TS com intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
