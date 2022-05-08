import { getInitials } from "../lib/utils";
import * as A from "@radix-ui/react-avatar";

export type AvatarProps = {
  src?: string | null;
  name?: string | null;
};

export const Avatar: React.FC<AvatarProps> = ({ src, name }) => (
  <A.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none h-12 w-12 rounded-full border">
    <A.Image className="w-full f-full object-cover" src={src || undefined} />
    <A.Fallback
      className="w-full h-full flex items-center justify-center text-md leading-none font-medium"
      delayMs={600}
    >
      {getInitials(name)}
    </A.Fallback>
  </A.Root>
);
