import LoginForm from "@/components/auth/LoginForm";
import { getSafeAdminPath } from "@/lib/auth-config";

type Props = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function MahalaxmiControlPage({
  searchParams,
}: Props) {
  const { next } = await searchParams;

  const nextPath = getSafeAdminPath(
    Array.isArray(next) ? next[0] : next ?? null
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3EDE2] p-6">
      <LoginForm nextPath={nextPath} />
    </main>
  );
}