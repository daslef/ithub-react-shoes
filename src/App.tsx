import { useState, useEffect, type ChangeEvent } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const baseUrl = "http://localhost:3000";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

type UsersState = User[] | null;
type PostsState = Post[] | null;

type FetchErrorState = Error | null;

function App() {
  const [posts, setPosts] = useState<PostsState>(null);
  const [users, setUsers] = useState<UsersState>(null);
  const [selectedUserId, selectUserId] = useState<number | null>(null)

  const [isLoading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<FetchErrorState>(null);

  useEffect(() => {
    setLoading(true);

    fetch(baseUrl + "/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error with status" + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        setFetchError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   setLoading(true);

  //   fetch(baseUrl + "/posts")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Error with status" + response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setPosts(data);
  //     })
  //     .catch((error) => {
  //       setFetchError(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <>
      <section className="users">
        <h2>Users</h2>

        {users === null && <p>No users found...</p>}

        {fetchError && <p>Error {fetchError.message}</p>}

        {isLoading && (
          <img src={reactLogo} className="logo react" alt="React logo" />
        )}

        {users?.map((user) => {
          return (
            <section key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </section>
          );
        })}
      </section>

      <main className="posts">
        <h2>Posts</h2>

        {posts === null && <p>No posts found...</p>}

        {fetchError && <p>Error {fetchError.message}</p>}

        {isLoading && (
          <img src={reactLogo} className="logo react" alt="React logo" />
        )}

        {posts?.slice(0, 5).map((post) => {
          return (
            <section key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </section>
          );
        })}
      </main>
    </>
  );
}

export default App;
