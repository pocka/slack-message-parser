/** @jsx h */
import { h } from "../deps/nano_jsx.ts";

export const Title = ({ children }: { children: unknown }) => (
  <title>{children} | slack-message-parser</title>
);
