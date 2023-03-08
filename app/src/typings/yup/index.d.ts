import { StringSchema, StringSchemaConstructor } from "yup";

declare module 'yup' {
    export interface StringSchema {
      ethereum(): StringSchema;
    }
  }