import type { GetServerSidePropsContext } from 'next';
import nookies from "nookies";
import { admin } from "../config/firebase/admin";

const Home = ({ message }: { message: string}) => {
  return (
    <div>
     {message}
    </div>
  )
}

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await admin.auth().verifyIdToken(cookies.token);
    
    const { uid, email } = token;

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();

    return { props: {} as never };
  }
};
