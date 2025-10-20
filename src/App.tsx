import { useState, useEffect } from "react";
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';

``import "./App.css";

import reactLogo from "./assets/react.svg";

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

  useEffect(() => {
    if (selectedUserId === null) {
      return
    }

    setLoading(true);

    fetch(baseUrl + "/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error with status" + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        setFetchError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedUserId]);

  return (
    <MantineProvider>
      <section className="users">
        {users === null && <p>No users found...</p>}

        {users?.map((user) => {
          return (
            <section
              className="user"
              key={user.id}
              onClick={() => selectUserId(user.id)}
              style={{ borderColor: selectedUserId != user.id ? "white" : "green" }}
            >
              <h3>{user.name}</h3>
              <p>{user.website}</p>
            </section>
          );
        })}
      </section>

      <main className="posts">
        <h2>Posts</h2>

        {posts === null && <p>No posts found...</p>}
        {selectedUserId === null && <p>Please, select user!</p>}

        {posts?.slice(0, 5).map((post) => {
          return (
            <section key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </section>
          );
        })}
      </main>

      {fetchError && <section className="error">{fetchError.message}</section>}

      {isLoading && (
        <img src={reactLogo} className="logo spinner" alt="spinner" />
      )}
    </MantineProvider>
  );
}

export default App;
