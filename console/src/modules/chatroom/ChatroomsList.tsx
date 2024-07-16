import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  ChatroomDataFragment,
  ChatroomsListDocument,
  useResolveChatroomMutation,
} from "~src/codegen/graphql";

import { ChatroomListItem } from "./ChatroomListItem";
import { useState } from "react";

export type ChatroomsListProps = {
  loading?: boolean;
  chatrooms: ChatroomDataFragment[];
};

export const ChatroomsList: React.FC<ChatroomsListProps> = ({
  loading,
  chatrooms,
}) => {
  const [resolve, setResolve] = useState<ChatroomDataFragment | null>(null);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {chatrooms.length === 0 && (
          <Alert severity="info" variant="outlined">
            No chatrooms.
          </Alert>
        )}
        {chatrooms.map((chatroom) => (
          <ChatroomListItem
            key={chatroom.id}
            chatroom={chatroom}
            onResolve={() => {
              setResolve(chatroom);
            }}
          />
        ))}
      </Box>
      <ResolveChatroom
        chatroom={resolve}
        onComplete={() => {
          setResolve(null);
        }}
      />
    </>
  );
};

function ResolveChatroom({
  chatroom,
  onComplete,
}: {
  chatroom: Pick<ChatroomDataFragment, "id" | "label"> | null;
  onComplete(): void;
}) {
  const [resolveChatroom, status] = useResolveChatroomMutation({
    refetchQueries: [ChatroomsListDocument],
  });
  return (
    <Dialog
      maxWidth="xs"
      open={!!chatroom}
      onClose={() => {
        status.reset();
        onComplete();
      }}
    >
      <DialogTitle>Resolve Chatroom</DialogTitle>
      <DialogContent dividers>
        Are you sure you want to resolve the chatroom{" "}
        <strong>{chatroom?.label}</strong>?
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography color={status.error ? "error.main" : undefined}>
            {status.error
              ? "Error - please try again."
              : status.loading
              ? "Please wait..."
              : null}
          </Typography>
          <div>
            <Button
              size="small"
              autoFocus
              disabled={status.loading}
              onClick={() => {
                status.reset();
                onComplete();
              }}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={async () => {
                if (chatroom) {
                  await resolveChatroom({ variables: { id: chatroom.id } });
                }
                onComplete();
              }}
              disabled={status.loading}
              startIcon={
                status.loading ? (
                  <CircularProgress color="inherit" size="1em" />
                ) : null
              }
            >
              Resolve
            </Button>
          </div>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
