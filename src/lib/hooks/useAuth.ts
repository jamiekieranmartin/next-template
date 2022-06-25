import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

export const useAuth = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const { query } = useRouter();
  const error = String(query.error ?? "");

  return {
    session,
    signIn: () => {
      setLoading(true);
      signIn("github", {
        callbackUrl: "/teamss",
      });
    },
    signOut,
    loading,
    error,
  };
};
