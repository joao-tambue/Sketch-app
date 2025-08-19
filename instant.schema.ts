import { i } from "@instantdb/react-native";

// Tipos fortes para mensagens
export type MessageType = "text" | "image" | "video" | "audio";

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
      text: i.string().optional(), // mensagem de texto (opcional se for mídia)
      type: i.string(), // validado depois pelo tipo MessageType
      mediaUri: i.string().optional(), // URI da mídia se não for texto
      createdAt: i.number(), // timestamp
      editedAt: i.number().optional(), // quando foi editada
      deleted: i.boolean().optional(), // mensagem apagada (soft delete)
    }),

    presence: i.entity({
      user: i.string(), // nome do usuário
      typing: i.boolean(), // está digitando ou não
      online: i.boolean().optional(),
      lastActive: i.number().optional(),
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

// Modelo TS mais forte para mensagens
export interface Message {
  id: string;
  user: string;
  text?: string;
  type: MessageType;
  mediaUri?: string;
  createdAt: number;
  editedAt?: number;
  deleted?: boolean;
}

export default schema;