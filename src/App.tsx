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

type PostsState = Post[] | null;
type FetchErrorState = Error | null;

function App() {
  function handleLimitInput(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value)
    
    if (Number.isFinite(value)) {
      setLimit(value);
    }
  }

  const [posts, setPosts] = useState<PostsState>(null);
  const [isLoading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<FetchErrorState>(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <h1>Posts</h1>

      <input
        type="text"
        name="limit"
        id="limit"
        placeholder="Limit of posts"
        onChange={handleLimitInput}
      />

      {posts === null && <p>No posts found...</p>}

      {fetchError && <p>Error {fetchError.message}</p>}

      {isLoading && (
        <img src={reactLogo} className="logo react" alt="React logo" />
      )}

      {posts?.slice(0, limit).map((post) => {
        return (
          <section key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </section>
        );
      })}
    </>
  );
}

export default App;
