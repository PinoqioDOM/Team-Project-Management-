import { useState, useEffect, useCallback } from "react";
import { supabase } from "../libraries/supabase";
import { useAuth } from "../hooks/useAuth";

interface User {
  name: string;
}

interface Comment {
  id: string;
  created_at: string;
  comment_text: string;
  user_id: string;
  users: User[]; 
  parent_id: string;
  parent_type: 'task' | 'project';
}

interface CommentsSectionProps {
  parentId: string; 
  parentType: 'task' | 'project';
}

const CommentsSection = ({ parentId, parentType }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useAuth();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        created_at,
        comment_text,
        user_id,
        users ( name ),
        parent_id,
        parent_type
      `)
      .eq("parent_id", parentId)
      .eq("parent_type", parentType)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
      setComments([]);
    } else {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [parentId, parentType]);

  const addComment = async () => {
    if (!newComment.trim() || !userData) return;

    const { error } = await supabase.from("comments").insert({
      comment_text: newComment,
      parent_id: parentId,
      parent_type: parentType,
      user_id: userData.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setNewComment("");
    }
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase.channel(`comments-${parentType}-${parentId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `parent_id=eq.${parentId}`,
      },
      () => {
        fetchComments();
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [parentId, parentType, fetchComments]);

  if (loading) {
    return <div className="text-white text-sm sm:text-base">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm sm:text-base">Error: {error}</div>;
  }

  return (
    <div className="rounded-lg">
      <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Comments</h3>
      <div className="space-y-2 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700 p-2 sm:p-3 rounded-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                <span className="font-medium text-white text-sm sm:text-base">
                  {comment.users[0]?.name || "Unknown User"}
                </span>
                <span className="text-xs sm:text-sm text-gray-400">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-snug break-words">{comment.comment_text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No comments yet.</p>
        )}
      </div>
      <div className="mt-3 sm:mt-4">
        <textarea
          className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none text-sm sm:text-base"
          rows={2}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="mt-2 w-full p-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;