import { useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();
  return (
    <div>
      {status === 'authenticated' && data != null && (
        <>
          <h2>Welcome {data.user.firstname}</h2>
          <p>User Id: {data.user.id}</p>
        </>
      )}
    </div>
  );
}