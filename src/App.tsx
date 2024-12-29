import { client } from "./axios";
import { useEffect, useState } from "react";
import { z } from "zod";

const tweetSchema = z.object({
  id: z.number(),
  content: z.string(),
  updatedAt: z.string(),
  userId: z.number(),
});

type Tweet = z.infer<typeof tweetSchema>;

function App() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getTweets = async () => {
      try {
        setLoading(true);
        const response = await client.get("/api/tweets");
        tweetSchema.array().parse(response.data);
        setTweets(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Ooops! Something went wrong!"));
        }
      }
      setLoading(false);
    };
    getTweets();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <ul>
      {tweets.map((tweet) => (
        <li key={tweet.id}>{tweet.content}</li>
      ))}
    </ul>
  );
}

export default App;
