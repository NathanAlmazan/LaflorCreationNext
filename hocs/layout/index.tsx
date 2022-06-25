import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const AuthWrapper = dynamic(() => import("./AuthWrapper"));
const MainWrapper = dynamic(() => import("./MainWrapper"));

function AppWrapper({ children }: {children: React.ReactNode }) {
  const router = useRouter();

  if (['/login', '/register'].includes(router.pathname)) 
    return <AuthWrapper>{children}</AuthWrapper>;

  return <MainWrapper>{children}</MainWrapper>
}

export default AppWrapper