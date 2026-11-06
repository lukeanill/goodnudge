// The same instructions as /good-nudge.md, on a .txt address. Some web readers (ChatGPT's, for one) refuse or fail on a .md address, and
// a plain .txt is the most widely readable. Keep both: /good-nudge.md is what older copies of the prompt point at.
export { GET } from "../good-nudge.md/route";
export const revalidate = 60;
